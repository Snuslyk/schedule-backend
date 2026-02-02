import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { GroupCreateDto, GroupDto } from './group.dto'

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: id },
    })

    if (!group) throw new NotFoundException(`Group with id ${id} not found`)

    return group
  }

  async getByName(name: string) {
    const group: GroupDto | null = await this.prisma.group.findUnique({
      where: { name: name }
    })

    if (!group) throw new NotFoundException(`Group with id ${name} not found`)

    return group
  }

  async create(dto: GroupCreateDto) {
    try {
      return await this.prisma.group.create({
        data: {
          name: dto.name,
          schedule: undefined
        }
      })
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException(`Group with name ${dto.name} already exists`)
      }
      throw e
    }
  }

  async deleteById(id: number) {
    try {
      await this.prisma.group.delete({ where: { id: id } })
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Group with id ${id} not found`)
      }
      throw e
    }
  }

  async deleteByName(name: string) {
    try {
      await this.prisma.group.delete({ where: { name: name } })
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Group with name ${name} not found`)
      }
      throw e
    }
  }
}
