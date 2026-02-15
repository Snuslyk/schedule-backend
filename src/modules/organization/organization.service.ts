import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateOrganizationDto } from './organization.dto'

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: dto,
    })
  }

  createMany(dtos: CreateOrganizationDto[]) {
    return this.prisma.organization.createMany({
      data: dtos,
      skipDuplicates: false,
    })
  }
}
