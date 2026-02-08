import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import { SlotDto } from '../../slot/slot.dto'
import { LessonDto } from '../../lesson/lesson.dto'
import { WeekType } from '../../../../generated/prisma/enums'
import { getWeekDayIndex, getWeekParity, startOfWeek } from '../../../utils/date'
import { DayDto } from '../../day/day.dto'
import { TeacherDto } from '../../teacher/teacher.dto'

type LessonWithGroup = LessonDto & { groupName: string }

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
    const teacher: TeacherDto | null = await this.fetchTeacherWithLessons(teacherId)

    if (!teacher) throw new BadRequestException(`Teacher with id ${teacherId} not found`)

    const hasBothParities = this.hasEvenAndOddWeeks(teacher.lessons!)

    const dayMap = this.initDayMap(7)
    this.populateDayMap(dayMap, teacher.lessons!, startOfWeekDate)

    const days: DayDto[] = this.dayMapToDays(dayMap)
    const weekType = hasBothParities ? getWeekParity(startOfWeekDate) : WeekType.OTHER
    return { weekType, days }
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
                    dayId: true
                  }
                },
                lessons: { select: { id: true } },
                weekTemplate: {
                  select: {
                    id: true,
                    type: true,
                    days: { select: { id: true } },
                    schedule: { select: { group: { select: { name: true } } } }
                  }
                }
              }
            }
          }
        }
      }
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
    const dayMap = new Map<number, { slots: SlotDto[]; lessons: LessonWithGroup[] }>()
    for (let i = 0; i < length; i++) {
      dayMap.set(i, { slots: [], lessons: [] })
    }
    return dayMap
  }

  private populateDayMap(
    dayMap: Map<number, { slots: SlotDto[]; lessons: LessonWithGroup[] }>,
    lessons: LessonDto[],
    start: Date
  ) {
    const requestedParity = getWeekParity(start)

    for (const lesson of lessons) {
      const { day: lessonDay, id: lessonId, ...finalLesson } = lesson
      if (!lessonDay) continue

      const groupSlots = lessonDay.slots ?? []
      const groupLessons = lessonDay.lessons ?? []
      const groupWeekTemplate = lessonDay.weekTemplate
      const templateType = groupWeekTemplate?.type

      const dayOfWeek = groupWeekTemplate?.days?.findIndex(d => d.id === lessonDay.id)
      if (dayOfWeek == null || dayOfWeek < 0) continue

      let isNextWeek = false

      if (templateType === WeekType.EVEN && requestedParity === WeekType.ODD) {
        isNextWeek = true
      }

      if (templateType === WeekType.ODD && requestedParity === WeekType.EVEN) {
        isNextWeek = true
      }

      if (isNextWeek) continue

      const slotIndex = groupLessons.findIndex(gl => gl.id === lessonId)
      const slot = groupSlots[slotIndex]
      const groupName = lessonDay.weekTemplate?.schedule?.group?.name ?? ''

      const entry = dayMap.get(dayOfWeek)
      if (!entry) continue

      if (!slot) throw new NotFoundException(`Slot for lesson ${lesson.id} (day ${lessonDay.id}) not found`)
      
      entry.slots.push(slot)
      entry.lessons.push({ ...finalLesson, groupName })
    }
  }

  private dayMapToDays(dayMap: Map<number, { slots: SlotDto[]; lessons: LessonWithGroup[] }>) {
    return Array.from(dayMap.values()).map(d => ({ slots: d.slots, lessons: d.lessons }))
  }

}