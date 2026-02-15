import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateScheduleDto } from './schedule.dto'
import { GroupScheduleService } from './services/group-schedule.service'
import { TeacherScheduleService } from './services/teacher-schedule.service'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { getWeekDayIndex, isSameWeek, msUntilEndOfDay } from '../../utils/date'

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupSchedule: GroupScheduleService,
    private readonly teacherSchedule: TeacherScheduleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getGroupWeek(
    weekDate: Date,
    groupName: string,
    mode: 'parity' | 'other',
  ) {
    const cacheKey = `group_week:${groupName}`

    const thisWeekDate = new Date()

    return this.cacheOrCompute(
      cacheKey,
      isSameWeek(thisWeekDate, weekDate),
      () => this.groupSchedule.getGroupWeek(weekDate, groupName, mode),
    )
  }

  async getGroupDay(
    dayDate: Date,
    groupName: string,
    mode: 'parity' | 'other',
  ) {
    const week = await this.getGroupWeek(dayDate, groupName, mode)
    const dayIndex = getWeekDayIndex(dayDate)
    return week.days![dayIndex] ?? { lessons: [], slots: [] }
  }

  async getTeacherWeek(weekDate: Date, teacherId: number) {
    const cacheKey = `teacher_week:${teacherId}`

    const thisWeekDate = new Date()

    return this.cacheOrCompute(
      cacheKey,
      isSameWeek(thisWeekDate, weekDate),
      () => this.teacherSchedule.getTeacherWeek(teacherId, weekDate),
    )
  }

  async getTeacherDay(dayDate: Date, teacherId: number) {
    const week = await this.getTeacherWeek(dayDate, teacherId)
    const dayIndex = getWeekDayIndex(dayDate)
    return week.days[dayIndex] ?? { lessons: [], slots: [] }
  }

  private async cacheOrCompute<T>(
    cacheKey: string,
    check: boolean,
    compute: () => Promise<T>,
  ): Promise<T> {
    if (!check) return await compute()

    const cached = await this.cacheManager.get<T>(cacheKey)
    if (cached) return cached

    const ttl: number = msUntilEndOfDay()

    const result = await compute()
    await this.cacheManager.set(cacheKey, result, ttl)
    return result
  }

  async create(dto: CreateScheduleDto) {
    return this.createMany([dto])
  }

  async createMany(dtos: CreateScheduleDto[]) {
    try {
      return await this.prisma.schedule.createMany({
        data: dtos.map((dto) => ({
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
