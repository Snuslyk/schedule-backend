import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import {
  getWeekDayIndex,
  getWeekParity,
  isDateInRange,
  isSameWeek,
  isWeekDayInRange,
  startOfWeek,
} from '../../utils/date'
import { CreateScheduleDto, ScheduleDto } from './schedule.dto'
import { WeekTemplateDto } from '../week-template/week-template.dto'
import { ReplaceDto } from '../replace/replace.dto'

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getParityGroupWeek(weekDate: Date, groupName: string) {
    const group = await this.getGroup(groupName)
    const schedule: ScheduleDto = await this.getSchedule(group.id, groupName)

    const startOfWeekDate = startOfWeek(weekDate)
    const week = this.getWeekTemplate(schedule, startOfWeekDate)

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

  private getWeekTemplate(schedule: ScheduleDto, start: Date) {
    const weekParity = getWeekParity(start)
    const week = schedule.weekTemplate.find(w => w.type === weekParity)

    if (!week) {
      throw new BadRequestException(
        `Schedule has no ${weekParity} week template`,
      )
    }

    return week
  }

  private applyScheduleRange(week: WeekTemplateDto, start: Date, schedule: ScheduleDto) {
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

  async create(dto: CreateScheduleDto) {
    try {
      return await this.prisma.schedule.create({
        data: {
          groupId: dto.groupId,
          start: dto.start,
          end: dto.end,
        },
      })
    } catch (e) {
      if (e.code === 'P2003') {
        throw new NotFoundException(`Group with id ${dto.groupId} not found`)
      }
      throw e
    }
  }
}