import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class OwnerService {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string, quantity: number) {
    if (quantity > 10) {
      throw new BadRequestException(
        'Quantity must be less than or equal to 10'
      )
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      return this.findByEmptyName(quantity)
    }

    return this.findBySearchName(trimmedName, quantity)
  }

  private async findByEmptyName(quantity: number) {
    const half = Math.ceil(quantity / 2)

    const [groups, teachers] = await Promise.all([
      this.prisma.group.findMany({
        take: half,
        select: { name: true },
      }),
      this.prisma.teacher.findMany({
        take: quantity - half,
        select: { name: true },
      }),
    ])

    return [...groups, ...teachers]
  }

  private async findBySearchName(name: string, quantity: number) {
    const groups = await this.prisma.group.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      take: quantity,
      select: { name: true },
    })

    const remaining = quantity - groups.length
    if (remaining <= 0) return groups

    const teachers = await this.prisma.teacher.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      take: remaining,
      select: { name: true },
    })

    return [...groups, ...teachers]
  }
}
