import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common'
import { OwnerService } from './owner.service'

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get()
  findByName(@Query('name') name: string, @Query('quantity', ParseIntPipe) quantity: number) {
    return this.ownerService.findByName(name, quantity)
  }

}
