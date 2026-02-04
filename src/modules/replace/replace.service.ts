import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateReplaceDto } from './replace.dto'

@Injectable()
export class ReplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReplaceDto, groupName: string) {

    const group = await this.prisma.group.findUnique({
      where: { name: groupName },
      select: {
        schedule: {
          select: { id: true }
        }
      }
    })

    if (!group) {
      throw new BadRequestException(
        `There is no group with name ${groupName}!`,
      );
    }

    if (!group.schedule) {
      throw new BadRequestException(
        `There is no schedule with group name ${groupName}!`,
      );
    }

    return this.prisma.replace.create({
      data: {
        date: dto.date,
        slotNumber: dto.slotNumber,
        scheduleId: group.schedule.id,
        classroom: dto.classroom,
        teacherId: dto.teacherId,
        isAvailable: dto.isAvailable,
        subjectId: dto.subjectId
      },
    });
  }

}
