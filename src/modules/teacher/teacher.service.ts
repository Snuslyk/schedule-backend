import { Injectable } from '@nestjs/common';
import { TeacherCreateDto } from './teacher.dto';
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(dto: TeacherCreateDto) {
    return this.prisma.teacher.create({ data: dto })
  }

  findAll() {
    return `This action returns all teacher`;
  }

  findOne(id: number) {
    return this.prisma.teacher.findUnique({ where: { id: id } })
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
