import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class OwnerService {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string, quantity: number) {
    const groups: { name: string }[] = await this.prisma.group.findMany({
      where: { name: { startsWith: name, mode: 'insensitive' } },
      take: quantity,
      select: { name: true },
    })
    const teachers: { name: string }[] = await this.prisma.teacher.findMany({
      where: { name: { startsWith: name, mode: 'insensitive' } },
      take: quantity,
      select: { name: true },
    })

    return groups.concat(teachers)
  }
}
