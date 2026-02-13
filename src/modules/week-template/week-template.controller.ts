import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common"
import { WeekTemplateService } from "./week-template.service"
import { CreateWeekTemplateDto } from "./week-template.dto"
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('WeekTemplate')
@Controller('week-template')
export class WeekTemplateController {
  constructor(private readonly weekTemplateService: WeekTemplateService) {}

  @Post(':name')
  @ApiOperation({ summary: 'Create a week template for a group' })
  @ApiParam({ name: 'name', type: String, description: 'Group name', example: '11A' })
  @ApiBody({ type: CreateWeekTemplateDto })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateWeekTemplateDto,
    @Param('name') group: string
  ) {
    return this.weekTemplateService.create(dto, group)
  }

  @Post(':name/bulk')
  @ApiOperation({ summary: 'Create multiple week templates for a group' })
  @ApiParam({ name: 'name', type: String, description: 'Group name', example: '11A' })
  @ApiBody({ type: [CreateWeekTemplateDto] })
  @HttpCode(HttpStatus.CREATED)
  createMany(
    @Body() dtos: CreateWeekTemplateDto[],
    @Param('name') group: string
  ) {
    return this.weekTemplateService.createMany(dtos, group)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a week template by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Week template ID', example: 1 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.weekTemplateService.deleteById(id)
  }
}