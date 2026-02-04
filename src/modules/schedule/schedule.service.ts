import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateScheduleDto } from './schedule.dto'
import { GroupScheduleService } from './services/group-schedule.service'

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupSchedule: GroupScheduleService,
  ) {}

  async getGroupWeek(weekDate: Date, groupName: string, mode: 'parity' | 'other') {
    return this.groupSchedule.getGroupWeek(weekDate, groupName, mode)
  }

  async getGroupDay(date: Date, groupName: string, mode: 'parity' | 'other') {
    return this.groupSchedule.getGroupDay(date, groupName, mode)
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