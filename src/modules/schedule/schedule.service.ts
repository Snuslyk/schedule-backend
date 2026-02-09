import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from "../../prisma/prisma.service"
import { CreateScheduleDto } from "./schedule.dto"
import { GroupScheduleService } from "./services/group-schedule.service"
import { TeacherScheduleService } from "./services/teacher-schedule.service"
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { isSameDay, isSameWeek } from '../../utils/date'

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly groupSchedule: GroupScheduleService,
    private readonly teacherSchedule: TeacherScheduleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getGroupWeek(thisWeekDate: Date, weekDate: Date, groupName: string, mode: "parity" | "other") {
    return this.cacheOrCompute('group_week', isSameWeek(thisWeekDate, weekDate), () =>
      this.groupSchedule.getGroupWeek(weekDate, groupName, mode)
    )
  }

  async getGroupDay(thisDayDate: Date, dayDate: Date, groupName: string, mode: "parity" | "other") {
    return this.cacheOrCompute('group_day', isSameDay(thisDayDate, dayDate), () =>
      this.groupSchedule.getGroupDay(dayDate, groupName, mode)
    )
  }

  async getTeacherWeek(thisWeekDate: Date, weekDate: Date, id: number) {
    return this.cacheOrCompute('teacher_week', isSameWeek(thisWeekDate, weekDate), () =>
      this.teacherSchedule.getTeacherWeek(id, weekDate)
    )
  }

  async getTeacherDay(thisDayDate: Date, dayDate: Date, id: number) {
    return this.cacheOrCompute('teacher_day', isSameDay(thisDayDate, dayDate), () =>
      this.teacherSchedule.getTeacherDay(id, dayDate)
    )
  }

  private async cacheOrCompute<T>(
    cacheKey: string,
    check: boolean,
    compute: () => Promise<T>,
  ): Promise<T> {
    if (!check) return await compute()

    const cached = await this.cacheManager.get<T>(cacheKey)
    if (cached) return cached

    const result = await compute()
    await this.cacheManager.set(cacheKey, result)
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
      if (e.code === "P2003") {
        throw new NotFoundException("One or more groups not found")
      }
      throw e
    }
  }
}
