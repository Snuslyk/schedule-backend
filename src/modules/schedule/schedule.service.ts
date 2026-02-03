import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { getWeekDayIndex, isSameWeek } from '../../utils/date'
import { ScheduleCreateDto } from './schedule.dto'

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getWeek(start: Date, groupName: string) {
    const group = await this.prisma.group.findUnique({
      where: { name: groupName },
    })

    if (!group) {
      throw new BadRequestException(
        `There is no group with name ${groupName}!`,
      )
    }

    const schedule = await this.prisma.schedule.findUnique({
      where: { groupId: group.id },
      include: {
        replaces: {
          omit: {
            id: true,
            scheduleId: true,
          },
        },
        weekTemplate: {
          omit: {
            id: true,
            scheduleId: true
          },
          include: {
            days: {
              omit: {
                id: true,
                weekTemplateId: true
              },
              include: {
                lessons: {
                  omit: {
                    id: true,
                    dayId: true
                  }
                },
                slots: {
                  omit: {
                    id: true,
                    dayId: true
                  }
                },
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

    const week = schedule.weekTemplate

    if (!week) {
      throw new BadRequestException('Schedule has no week template')
    }

    const replaces = schedule.replaces.filter((r) => isSameWeek(r.date, start))

    if (!replaces) return week

    replaces.forEach(replace => {
      const dayIndex = getWeekDayIndex(replace.date)
      const day = week.days[dayIndex]

      const lessonIndex = day.lessons.findIndex(
        (l) => l.slotNumber === replace.slotNumber,
      )

      if (lessonIndex !== -1) {
        day.lessons[lessonIndex].classroom = replace.classroom
        day.lessons[lessonIndex].isAvailable = replace.isAvailable
        day.lessons[lessonIndex].teacherId = replace.teacherId
        day.lessons[lessonIndex].subjectId = replace.teacherId
      }
    })

    return week
  }

  async create(dto: ScheduleCreateDto) {
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