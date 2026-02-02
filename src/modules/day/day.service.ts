import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class DayService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: number) {
    const day = await this.prisma.day.findUnique({
      where: {
        id: id
      },
      include: {
        lesson: true,
        slot: true
      }
    })
    if (!day) throw new NotFoundException(`Day with id ${id} not found`)
    return day
  }

  async deleteById(id: number) {
    try {
      await this.prisma.day.delete({ where: { id: id } })
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Day with id ${id} not found`)
      }
      throw e
    }
  }

}
