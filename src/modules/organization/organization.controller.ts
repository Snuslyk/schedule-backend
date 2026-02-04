import { Body, Controller, Post } from '@nestjs/common'
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './organization.dto'

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() data: CreateOrganizationDto) {
    return this.organizationService.create(data)
  }

  @Post('bulk')
  createMany(@Body() data: CreateOrganizationDto[]) {
    return this.organizationService.createMany(data)
  }
}
