import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma.service'
import {
  getWeekDayIndex,
  getWeekParity,
  isDateInRange,
  isSameWeek,
  isWeekDayInRange,
  startOfWeek,
} from '../../../utils/date'
import { ScheduleDto } from '../schedule.dto'
import { WeekTemplateDto } from '../../week-template/week-template.dto'
import { ReplaceDto } from '../../replace/replace.dto'
import { GroupDto } from '../../group/group.dto'
import { WeekType } from '../../../../generated/prisma/enums'
import { DayDto } from '../../day/day.dto'

@Injectable()
export class GroupScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroupDay(date: Date, groupName: string, mode: 'parity' | 'other'): Promise<DayDto> {
    const week = await this.getGroupWeek(date, groupName, mode)
    const dayIndex = getWeekDayIndex(date)
    const day = week.days[dayIndex]

    return day ?? { lessons: [], slots: [] }
  }

  async getGroupWeek(
    today: Date,
    groupName: string,
    mode: 'parity' | 'other',
  ) {
    const group: GroupDto = await this.getGroup(groupName)
    const schedule: ScheduleDto = await this.getSchedule(group.id, groupName)

    const startOfWeekDate = startOfWeek(today)
    const week =
      mode === 'parity'
        ? this.getParityWeekTemplate(schedule, startOfWeekDate)
        : this.getOtherWeekTemplate(schedule)

    this.applyScheduleRange(week, startOfWeekDate, schedule)

    const replaces = this.getWeekReplaces(schedule, startOfWeekDate)
    this.applyReplaces(week, replaces)

    return week
  }

  private async getGroup(groupName: string) {
    const group = await this.prisma.group.findUnique({
      where: { name: groupName },
    })

    if (!group) {
      throw new BadRequestException(
        `There is no group with name ${groupName}!`,
      )
    }

    return group
  }

  private async getSchedule(groupId: number, groupName: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { groupId },
      include: {
        replaces: {
          omit: { id: true, scheduleId: true },
        },
        weekTemplate: {
          omit: { id: true, scheduleId: true },
          include: {
            days: {
              omit: { id: true, weekTemplateId: true },
              include: {
                lessons: { omit: { id: true, dayId: true } },
                slots: { omit: { id: true, dayId: true } },
              },
            },
          },
        },
      },
    })

    if (!schedule) {
      throw new BadRequestException(
        `There is no schedule with this group name ${groupName}!`,
      )
    }

    return schedule
  }

  private getParityWeekTemplate(schedule: ScheduleDto, start: Date) {
    const weekParity = getWeekParity(start)
    const week = schedule.weekTemplate.find(w => w.type === weekParity)

    if (!week) {
      throw new BadRequestException(
        `Schedule has no ${weekParity} week template`,
      )
    }

    return week
  }

  private getOtherWeekTemplate(schedule: ScheduleDto) {
    const week = schedule.weekTemplate.find(w => w.type === WeekType.OTHER)

    if (!week) {
      throw new BadRequestException(
        `Schedule has no ${WeekType.OTHER} week template`,
      )
    }

    return week
  }

  private applyScheduleRange(
    week: WeekTemplateDto,
    start: Date,
    schedule: ScheduleDto,
  ) {
    week.days = week.days.map((day, index) =>
      isWeekDayInRange(start, index, schedule.start, schedule.end)
        ? day
        : { lessons: [], slots: [] },
    )
  }

  private getWeekReplaces(schedule: ScheduleDto, start: Date) {
    return schedule.replaces.filter(
      r =>
        isSameWeek(r.date, start) &&
        isDateInRange(r.date, schedule.start, schedule.end),
    )
  }

  private applyReplaces(week: WeekTemplateDto, replaces: ReplaceDto[]) {
    const lessonsByDayAndSlot = week.days.map(day => {
      const map = new Map<number, (typeof day.lessons)[number]>()
      for (const lesson of day.lessons) {
        map.set(lesson.slotNumber, lesson)
      }
      return map
    })

    for (const replace of replaces) {
      const dayIndex = getWeekDayIndex(replace.date)
      const day = week.days[dayIndex]
      if (!day) continue

      const lessonsBySlot = lessonsByDayAndSlot[dayIndex]
      if (!lessonsBySlot) continue

      const lesson = lessonsBySlot.get(replace.slotNumber)

      if (!lesson) continue

      lesson.classroom = replace.classroom
      lesson.isAvailable = replace.isAvailable
      lesson.teacherId = replace.teacherId
      lesson.subjectId = replace.subjectId
    }
  }
}

