import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { OrganizationService } from './organization.service'
import { CreateOrganizationDto } from './organization.dto'

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateOrganizationDto) {
    return this.organizationService.create(data)
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() data: CreateOrganizationDto[]) {
    return this.organizationService.createMany(data)
  }
}
