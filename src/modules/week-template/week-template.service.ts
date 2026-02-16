import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateWeekTemplateDto, WeekTemplateDto } from './week-template.dto'
import { plainToInstance } from 'class-transformer'
import { Mode, WeekType } from '../../../generated/prisma/enums'

@Injectable()
export class WeekTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWeekTemplateDto, groupId: number) {
    let weekTemplate: CreateWeekTemplateDto

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: {
        schedule: {
          select: { id: true, mode: true },
        },
      },
    })

    if (!group) {
      throw new BadRequestException(`There is no group with id ${groupId}!`)
    }

    if (!group.schedule) {
      throw new BadRequestException(
        `There is no schedule with group id ${groupId}!`,
      )
    }

    const dtoMode: Mode = dto.type === WeekType.OTHER
      ? Mode.OTHER
      : Mode.PARITY

    if (group.schedule.mode !== dtoMode) {
      throw new ConflictException(`Schedule mode is ${group.schedule.mode}, and your week type is ${dtoMode}`)
    }

    try {
      weekTemplate = await this.prisma.weekTemplate.create({
        data: {
          type: dto.type,
          scheduleId: group.schedule.id,
          days: {
            create: dto.days.map((d) => ({
              lessons: {
                create: d.lessons.map((l) => ({
                  classroom: l.classroom,
                  slotNumber: l.slotNumber,
                  slotLength: l.slotLength,
                  isAvailable: l.isAvailable,
                  teacherId: l.teacherId,
                  subjectId: l.subjectId,
                })),
              },
              slots: {
                create: d.slots.map((s) => ({
                  end: s.end,
                  start: s.start,
                })),
              },
            })),
          },
        },
        omit: {
          id: true,
          scheduleId: true,
        },
        include: {
          days: {
            omit: {
              id: true,
              weekTemplateId: true,
            },
            include: {
              lessons: {
                omit: {
                  id: true,
                  dayId: true,
                },
              },
              slots: {
                omit: {
                  id: true,
                  dayId: true,
                },
              },
            },
          },
        },
      })
    } catch (e) {
      if (e.code === 'P2003') {
        throw new NotFoundException(
          `Schedule with id ${group.schedule.id} not found`,
        )
      }
      if (e.code === 'P2002') {
        throw new ConflictException('Duplicate entry detected')
      }
      throw e
    }

    return plainToInstance(WeekTemplateDto, weekTemplate)
  }

  async createMany(dtos: CreateWeekTemplateDto[], groupId: number) {
    const results: WeekTemplateDto[] = []
    for (const dto of dtos) {
      const created = await this.create(dto, groupId)
      results.push(created)
    }
    return results
  }

  async deleteById(id: number) {
    try {
      await this.prisma.weekTemplate.delete({ where: { id: id } })
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Week Template with id ${id} not found`)
      }
      throw e
    }
  }
}
