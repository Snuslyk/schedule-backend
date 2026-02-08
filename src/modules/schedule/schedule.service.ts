import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateScheduleDto } from './schedule.dto'
import { GroupScheduleService } from './services/group-schedule.service'
import { TeacherScheduleService } from './services/teacher-schedule.service'

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupSchedule: GroupScheduleService,
    private readonly teacherSchedule: TeacherScheduleService,
  ) {}

  async getGroupWeek(weekDate: Date, groupName: string, mode: 'parity' | 'other') {
    return this.groupSchedule.getGroupWeek(weekDate, groupName, mode)
  }

  async getGroupDay(date: Date, groupName: string, mode: 'parity' | 'other') {
    return this.groupSchedule.getGroupDay(date, groupName, mode)
  }

  async getTeacherWeek(id: number, start: Date) {
    return this.teacherSchedule.getTeacherWeek(id, start)
  }

  getTeacherDay(id: number, date: Date) {
    return this.teacherSchedule.getTeacherDay(id, date)
  }

  async create(dto: CreateScheduleDto) {
    return this.createMany([dto])
  }

  async createMany(dtos: CreateScheduleDto[]) {
    try {
      return await this.prisma.schedule.createMany({
        data: dtos.map(dto => ({
          groupId: dto.groupId,
          start: dto.start,
          end: dto.end,
        })),
        skipDuplicates: false,
      })
    } catch (e) {
      if (e.code === 'P2003') {
        throw new NotFoundException('One or more groups not found')
      }
      throw e
    }
  }
}