import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateSubjectsDto } from './subject.dto'

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.subject.findMany()
  }

  create(dto: CreateSubjectsDto) {
    return this.prisma.subject.create({
      data: dto
    })
  }
}
