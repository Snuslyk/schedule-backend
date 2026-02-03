import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateSubjectDto } from './subject.dto'

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.subject.findMany()
  }

  create(dto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: dto
    })
  }
}
