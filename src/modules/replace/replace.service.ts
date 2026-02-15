import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateReplaceDto } from './replace.dto'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { isSameWeek } from '../../utils/date'

@Injectable()
export class ReplaceService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateReplaceDto, groupName: string) {
    const group = await this.prisma.group.findUnique({
      where: { name: groupName },
      select: {
        schedule: {
          select: { id: true },
        },
      },
    })

    if (!group) {
      throw new BadRequestException(`There is no group with name ${groupName}!`)
    }

    if (!group.schedule) {
      throw new BadRequestException(
        `There is no schedule with group name ${groupName}!`,
      )
    }

    const thisWeek = new Date()
    if (isSameWeek(thisWeek, dto.date)) {
      await this.cacheManager.del(groupName)
    }

    return this.prisma.replace.create({
      data: {
        date: dto.date,
        slotNumber: dto.slotNumber,
        scheduleId: group.schedule.id,
        classroom: dto.classroom,
        teacherId: dto.teacherId,
        isAvailable: dto.isAvailable,
        subjectId: dto.subjectId,
      },
    })
  }

  async createMany(dtos: CreateReplaceDto[], groupName: string) {
    const group = await this.prisma.group.findUnique({
      where: { name: groupName },
      select: {
        schedule: {
          select: { id: true },
        },
      },
    })

    if (!group) {
      throw new BadRequestException(`There is no group with name ${groupName}!`)
    }

    if (!group.schedule) {
      throw new BadRequestException(
        `There is no schedule with group name ${groupName}!`,
      )
    }

    const scheduleId = group.schedule.id

    const thisWeek = new Date()
    if (dtos.some((dto) => isSameWeek(thisWeek, dto.date))) {
      await this.cacheManager.del(groupName)
    }

    return this.prisma.replace.createMany({
      data: dtos.map((dto) => ({
        date: dto.date,
        slotNumber: dto.slotNumber,
        scheduleId: scheduleId,
        classroom: dto.classroom,
        teacherId: dto.teacherId,
        isAvailable: dto.isAvailable,
        subjectId: dto.subjectId,
      })),
      skipDuplicates: false,
    })
  }
}
