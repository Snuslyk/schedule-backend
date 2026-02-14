import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User } from '../../generated/prisma/client'

@Injectable()
export class UserPipe implements PipeTransform {
  constructor(private readonly prismaService: PrismaService) {}

  async transform(id: string) {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { id }
    })

    if (!user) throw new NotFoundException(`User with id ${id} not found`)

    return id;
  }
}
