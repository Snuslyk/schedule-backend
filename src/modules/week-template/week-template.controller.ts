import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { WeekTemplateService } from './week-template.service'
import { CreateWeekTemplateDto } from './week-template.dto'
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('WeekTemplate')
@Controller('week-template')
export class WeekTemplateController {
  constructor(private readonly weekTemplateService: WeekTemplateService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Create a week template for a group' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Group ID',
    example: 1,
  })
  @ApiBody({ type: CreateWeekTemplateDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateWeekTemplateDto, @Param('id', ParseIntPipe) groupId: number) {
    return this.weekTemplateService.create(dto, groupId)
  }

  @Post(':id/bulk')
  @ApiOperation({ summary: 'Create multiple week templates for a group' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Group ID',
    example: 1,
  })
  @ApiBody({ type: [CreateWeekTemplateDto] })
  @HttpCode(HttpStatus.CREATED)
  createMany(
    @Body() dtos: CreateWeekTemplateDto[],
    @Param('id', ParseIntPipe) groupId: number,
  ) {
    return this.weekTemplateService.createMany(dtos, groupId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a week template by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Week template ID',
    example: 1,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.weekTemplateService.deleteById(id)
  }
}
