import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common'
import { WeekTemplateService } from './week-template.service';
import { CreateWeekTemplateDto } from './week-template.dto'

@Controller('week-template')
export class WeekTemplateController {
  constructor(private readonly weekTemplateService: WeekTemplateService) {}

  @Post(':name')
  create(@Body() dto: CreateWeekTemplateDto, @Param('name') group: string) {
    return this.weekTemplateService.create(dto, group)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.weekTemplateService.deleteById(id)
  }

}
