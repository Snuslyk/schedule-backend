import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { PrismaService } from "../../../prisma/prisma.service"
import { SlotDto } from "../../slot/slot.dto"
import { LessonDto } from "../../lesson/lesson.dto"
import { WeekType } from "../../../../generated/prisma/enums"
import {
  getWeekDayIndex,
  getWeekParity,
  startOfWeek,
} from "../../../utils/date"
import { DayDto } from "../../day/day.dto"
import { TeacherDto } from "../../teacher/teacher.dto"

type LessonWithGroup = LessonDto & { groupName: string }

type DayItem = {
  dayOfWeek: number
  finalLesson: Omit<LessonDto, "day" | "id">
  groupName: string
  originalSlotNumber: number
  slotLength: number
  groupSlots: SlotDto[]
  slotIndex: number
}

@Injectable()
export class TeacherScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeacherDay(teacherId: number, date: Date) {
    const week = await this.getTeacherWeek(teacherId, date)
    const dayIndex = getWeekDayIndex(date)
    const day = week.days[dayIndex]

    return day ?? { slots: [], lessons: [] }
  }

  async getTeacherWeek(teacherId: number, dayOfWeek: Date) {
    const startOfWeekDate = startOfWeek(dayOfWeek)
    const teacher: TeacherDto | null =
      await this.fetchTeacherWithLessons(teacherId)

    if (!teacher)
      throw new BadRequestException(`Teacher with id ${teacherId} not found`)

    const hasBothParities = this.hasEvenAndOddWeeks(teacher.lessons!)

    const dayMap = this.initDayMap(7)
    this.populateDayMap(dayMap, teacher.lessons!, startOfWeekDate)

    const days: DayDto[] = this.dayMapToDays(dayMap)
    const weekType = hasBothParities
      ? getWeekParity(startOfWeekDate)
      : WeekType.OTHER
    return { type: weekType, days }
  }

  private async fetchTeacherWithLessons(teacherId: number) {
    return this.prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        name: true,
        lessons: {
          select: {
            id: true,
            classroom: true,
            slotNumber: true,
            slotLength: true,
            isAvailable: true,
            subject: { select: { name: true } },
            day: {
              select: {
                id: true,
                slots: {
                  omit: {
                    id: true,
                    dayId: true,
                  },
                },
                lessons: { select: { id: true } },
                weekTemplate: {
                  select: {
                    id: true,
                    type: true,
                    days: { select: { id: true } },
                    schedule: { select: { group: { select: { name: true } } } },
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  private hasEvenAndOddWeeks(lessons: LessonDto[]): boolean {
    let hasEven = false
    let hasOdd = false
    for (const lesson of lessons) {
      const type = lesson.day?.weekTemplate?.type
      if (type === WeekType.EVEN) hasEven = true
      if (type === WeekType.ODD) hasOdd = true
      if (hasEven && hasOdd) return true
    }
    return false
  }

  private initDayMap(length: number) {
    const dayMap = new Map<
      number,
      { slots: SlotDto[]; lessons: LessonWithGroup[] }
    >()
    for (let i = 0; i < length; i++) {
      dayMap.set(i, { slots: [], lessons: [] })
    }
    return dayMap
  }

  private populateDayMap(
    dayMap: Map<number, { slots: SlotDto[]; lessons: LessonWithGroup[] }>,
    lessons: LessonDto[],
    start: Date,
  ) {
    const requestedParity = getWeekParity(start)
    const byDay = this.collectLessonsByDay(lessons, requestedParity)
    this.fillDayMapFromByDay(dayMap, byDay)
  }

  private isLessonOnNextWeek(
    templateType: WeekType | undefined,
    requestedParity: WeekType,
  ): boolean {
    return (
      (templateType === WeekType.EVEN && requestedParity === WeekType.ODD) ||
      (templateType === WeekType.ODD && requestedParity === WeekType.EVEN)
    )
  }

  private collectLessonsByDay(
    lessons: LessonDto[],
    requestedParity: WeekType,
  ): Map<number, DayItem[]> {
    const byDay = new Map<number, DayItem[]>()

    for (const lesson of lessons) {
      const item = this.tryBuildDayItem(lesson, requestedParity)
      if (!item) continue

      const list = byDay.get(item.dayOfWeek) ?? []
      list.push(item)
      byDay.set(item.dayOfWeek, list)
    }

    return byDay
  }

  private tryBuildDayItem(
    lesson: LessonDto,
    requestedParity: WeekType,
  ): DayItem | null {
    const { day: groupDay, id: lessonId, ...finalLesson } = lesson
    if (!groupDay) return null

    const groupSlots = groupDay.slots ?? []
    const groupLessons = groupDay.lessons ?? []
    const templateType = groupDay.weekTemplate?.type

    const dayOfWeek = groupDay.weekTemplate?.days?.findIndex(
      (d) => d.id === groupDay.id,
    )
    if (dayOfWeek == null || dayOfWeek < 0) return null
    if (this.isLessonOnNextWeek(templateType, requestedParity)) return null

    const slotLength = lesson.slotLength ?? 1
    const originalSlotNumber = lesson.slotNumber ?? 1
    const slotIndex = originalSlotNumber - 1

    for (let i = 0; i < slotLength; i++) {
      const slot = groupSlots[slotIndex + i]
      if (!slot) {
        throw new NotFoundException(
          `Slot for lesson ${lessonId} (day ${groupDay.id}) not found`,
        )
      }
    }

    const groupName = groupDay.weekTemplate?.schedule?.group?.name ?? ""

    return {
      dayOfWeek,
      finalLesson,
      groupName,
      originalSlotNumber,
      slotLength,
      groupSlots,
      slotIndex,
    }
  }

  private fillDayMapFromByDay(
    dayMap: Map<number, { slots: SlotDto[]; lessons: LessonWithGroup[] }>,
    byDay: Map<number, DayItem[]>,
  ) {
    for (const [dayOfWeek, items] of byDay) {
      const sorted = [...items].sort(
        (a, b) => a.originalSlotNumber - b.originalSlotNumber,
      )
      const entry = dayMap.get(dayOfWeek)
      if (!entry) continue

      let nextSlotNumber = 1
      for (const item of sorted) {
        const { finalLesson, groupName, slotLength, groupSlots, slotIndex } =
          item
        for (let i = 0; i < slotLength; i++) {
          entry.slots.push(groupSlots[slotIndex + i])
        }
        entry.lessons.push({
          ...finalLesson,
          groupName,
          slotNumber: nextSlotNumber,
          slotLength,
        })
        nextSlotNumber += slotLength
      }
    }
  }

  private dayMapToDays(
    dayMap: Map<number, { slots: SlotDto[]; lessons: LessonWithGroup[] }>,
  ) {
    return Array.from(dayMap.values()).map((d) => ({
      slots: d.slots,
      lessons: d.lessons,
    }))
  }
}
