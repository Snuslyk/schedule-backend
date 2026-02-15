import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { SlotDto } from '../../slot/slot.dto'
import { LessonDto } from '../../lesson/lesson.dto'
import { WeekType } from '../../../../generated/prisma/enums'
import {
  getWeekDayIndex,
  getWeekParity,
  startOfWeek,
} from '../../../utils/date'
import { DayDto } from '../../day/day.dto'
import { TeacherDto } from '../../teacher/teacher.dto'

type ResolvedLesson = {
  lesson: Omit<LessonDto, 'day'>
  groupName: string
  dayOfWeek: number
  slotNumber: number
  slotLength: number
  slots: SlotDto[]
}

@Injectable()
export class TeacherScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeacherDay(teacherId: number, date: Date): Promise<DayDto> {
    const week = await this.getTeacherWeek(teacherId, date)
    const dayIndex = getWeekDayIndex(date)
    return week.days[dayIndex] ?? { lessons: [], slots: [] }
  }

  async getTeacherWeek(teacherId: number, date: Date) {
    const start = startOfWeek(date)
    const teacher: TeacherDto | null =
      await this.loadTeacherWithLessons(teacherId)
    if (!teacher) {
      throw new BadRequestException(`Teacher with id ${teacherId} not found`)
    }

    const parity = getWeekParity(start)
    const days = this.buildWeekDays(teacher.lessons!, parity)
    const type = this.teacherHasBothParities(teacher.lessons!)
      ? parity
      : WeekType.OTHER

    return { type, days }
  }

  private async loadTeacherWithLessons(teacherId: number) {
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
                  omit: { id: true, dayId: true },
                },
                lessons: { select: { id: true } },
                weekTemplate: {
                  select: {
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

  private teacherHasBothParities(lessons: LessonDto[]): boolean {
    const types = new Set(
      lessons
        .map((l) => l.day?.weekTemplate?.type)
        .filter(
          (t): t is WeekType => t === WeekType.EVEN || t === WeekType.ODD,
        ),
    )
    return types.has(WeekType.EVEN) && types.has(WeekType.ODD)
  }

  private buildWeekDays(
    lessons: LessonDto[],
    requestedParity: WeekType,
  ): DayDto[] {
    const resolved = lessons
      .map((lesson) => this.resolveLesson(lesson, requestedParity))
      .filter((r): r is ResolvedLesson => r !== null)

    const byDay = this.groupByDay(resolved)
    return this.daysFromGrouped(byDay)
  }

  private resolveLesson(
    lesson: LessonDto,
    requestedParity: WeekType,
  ): ResolvedLesson | null {
    const day = lesson.day
    if (!day?.weekTemplate) return null

    const templateType = day.weekTemplate.type
    if (templateType === WeekType.EVEN && requestedParity === WeekType.ODD)
      return null
    if (templateType === WeekType.ODD && requestedParity === WeekType.EVEN)
      return null

    const dayOfWeek = day.weekTemplate.days?.findIndex((d) => d.id === day.id)
    if (dayOfWeek == null || dayOfWeek < 0) return null

    const groupSlots = day.slots ?? []
    const slotNumber = lesson.slotNumber ?? 1
    const slotLength = lesson.slotLength ?? 1
    const startIndex = slotNumber - 1

    const slots: SlotDto[] = []
    for (let i = 0; i < slotLength; i++) {
      const slot = groupSlots[startIndex + i]
      if (!slot) {
        throw new NotFoundException(
          `Slot for lesson ${lesson.id} (day ${day.id}) not found`,
        )
      }
      slots.push(slot)
    }

    const groupName = day.weekTemplate.schedule?.group?.name ?? ''
    const { day: _day, ...lessonWithoutDay } = lesson

    return {
      lesson: lessonWithoutDay,
      groupName,
      dayOfWeek,
      slotNumber,
      slotLength,
      slots,
    }
  }

  private groupByDay(
    resolved: ResolvedLesson[],
  ): Map<number, ResolvedLesson[]> {
    const byDay = new Map<number, ResolvedLesson[]>()
    for (const r of resolved) {
      const resolvedLessons = byDay.get(r.dayOfWeek) ?? []
      resolvedLessons.push(r)
      byDay.set(r.dayOfWeek, resolvedLessons)
    }
    return byDay
  }

  private daysFromGrouped(byDay: Map<number, ResolvedLesson[]>): DayDto[] {
    const days: DayDto[] = []

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const items = (byDay.get(dayIndex) ?? []).sort(
        (a, b) => a.slots[0].start - b.slots[0].start,
      )

      const slots: SlotDto[] = []
      const lessons: (Omit<LessonDto, 'day'> & { groupName: string })[] = []
      let nextSlotNumber = 1

      for (const item of items) {
        slots.push(...item.slots)
        lessons.push({
          ...item.lesson,
          groupName: item.groupName,
          slotNumber: nextSlotNumber,
          slotLength: item.slotLength,
        })
        nextSlotNumber += item.slotLength
      }

      days.push({ slots, lessons })
    }

    return days
  }
}
