import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { OwnerService } from './owner.service';

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get(':name')
  findByName(@Param('name') name: string, @Query('quantity', ParseIntPipe) quantity: number) {
    return this.ownerService.findByName(name, quantity);
  }

}
