import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common'
import { OwnerService } from './owner.service'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Owner')
@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get()
  @ApiOperation({ summary: 'Find owners by name with a specified quantity' })
  @ApiQuery({
    name: 'name',
    type: String,
    description: 'Owner name to search',
    example: 'John',
  })
  @ApiQuery({
    name: 'quantity',
    type: Number,
    description: 'Maximum number of results',
    example: 5,
  })
  findByName(
    @Query('name') name: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.ownerService.findByName(name, quantity)
  }
}
