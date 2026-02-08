import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"

export enum OwnerType {
  GROUP = "group",
  TEACHER = "teacher",
}

export type Owner = {
  id: number
  name: string
  type: OwnerType
}

@Injectable()
export class OwnerService {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string, quantity: number): Promise<Owner[]> {
    if (quantity > 10) {
      throw new BadRequestException("Quantity must be less than or equal to 10")
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      return this.findByEmptyName(quantity)
    }

    return this.findBySearchName(trimmedName, quantity)
  }

  private async findByEmptyName(quantity: number): Promise<Owner[]> {
    const half = Math.ceil(quantity / 2)

    const [groups, teachers] = await Promise.all([
      this.prisma.group.findMany({
        take: half,
        select: { id: true, name: true },
      }),
      this.prisma.teacher.findMany({
        take: quantity - half,
        select: { id: true, name: true },
      }),
    ])

    // Добавляем тип к каждому объекту
    const typedGroups = groups.map((g) => ({ ...g, type: OwnerType.GROUP }))
    const typedTeachers = teachers.map((t) => ({
      ...t,
      type: OwnerType.TEACHER,
    }))

    return [...typedGroups, ...typedTeachers]
  }

  private async findBySearchName(
    name: string,
    quantity: number,
  ): Promise<Owner[]> {
    const groups = await this.prisma.group.findMany({
      where: { name: { contains: name, mode: "insensitive" } },
      take: quantity,
      select: { id: true, name: true },
    })

    const remaining = quantity - groups.length
    const typedGroups = groups.map((g) => ({ ...g, type: OwnerType.GROUP }))

    if (remaining <= 0) return typedGroups

    const teachers = await this.prisma.teacher.findMany({
      where: { name: { contains: name, mode: "insensitive" } },
      take: remaining,
      select: { id: true, name: true },
    })

    const typedTeachers = teachers.map((t) => ({
      ...t,
      type: OwnerType.TEACHER,
    }))

    return [...typedGroups, ...typedTeachers]
  }
}
