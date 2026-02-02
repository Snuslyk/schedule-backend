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
        replace: {
          include: {
            lesson: {
              omit: {
                id: true,
                dayId: true
              }
            },
          },
        },
        weekTemplate: {
          omit: {
            id: true,
            scheduleId: true
          },
          include: {
            day: {
              omit: {
                id: true,
                weekTemplateId: true
              },
              include: {
                lesson: {
                  omit: {
                    id: true,
                    dayId: true
                  }
                },
                slot: {
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

    const replace = schedule.replace.find((r) => isSameWeek(r.date, start))
    const week = schedule.weekTemplate

    if (!week) {
      throw new BadRequestException('Schedule has no week template')
    }

    //if (!replace) return week as WeekTemplateDto
    if (!replace) return week

    if (!replace.lesson)
      throw new BadRequestException('There is no lesson in replace!')

    const dayIndex = getWeekDayIndex(replace.date)
    const day = week.day[dayIndex]

    const lessonIndex = day.lesson.findIndex(
      (l) => l.slotNumber === replace.slotNumber,
    )

    if (lessonIndex !== -1) {
      day.lesson[lessonIndex] = replace.lesson
    }

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