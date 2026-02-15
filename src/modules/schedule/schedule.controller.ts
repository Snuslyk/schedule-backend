import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { ScheduleService } from './schedule.service'
import { DatePipe } from '../../date/date.pipe'
import { CreateScheduleDto } from './schedule.dto'
import { ModePipe } from './mode/mode.pipe'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('week/group')
  @ApiOperation({ summary: 'Get weekly schedule for a group' })
  @ApiQuery({
    name: 'week',
    type: String,
    description: 'Start date of the week (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'group', type: String, description: 'Group name' })
  @ApiQuery({
    name: 'mode',
    type: String,
    enum: ['parity', 'other'],
    description: 'Schedule mode',
  })
  @HttpCode(HttpStatus.OK)
  getGroupWeek(
    @Query('week', DatePipe) week: Date,
    @Query('group') group: string,
    @Query('mode', ModePipe) mode: 'parity' | 'other',
  ) {
    return this.scheduleService.getGroupWeek(week, group, mode)
  }

  @Get('day/group')
  @ApiOperation({ summary: 'Get daily schedule for a group' })
  @ApiQuery({ name: 'day', type: String, description: 'Date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'group', type: String, description: 'Group name' })
  @ApiQuery({
    name: 'mode',
    type: String,
    enum: ['parity', 'other'],
    description: 'Schedule mode',
  })
  @HttpCode(HttpStatus.OK)
  getParityGroupDay(
    @Query('day', DatePipe) day: Date,
    @Query('group') group: string,
    @Query('mode', ModePipe) mode: 'parity' | 'other',
  ) {
    return this.scheduleService.getGroupDay(day, group, mode)
  }

  @Get('week/teacher')
  @ApiOperation({ summary: 'Get weekly schedule for a teacher' })
  @ApiQuery({
    name: 'week',
    type: String,
    description: 'Start date of the week (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'id', type: Number, description: 'Teacher ID' })
  @HttpCode(HttpStatus.OK)
  getTeacherWeek(
    @Query('week', DatePipe) week: Date,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.scheduleService.getTeacherWeek(week, id)
  }

  @Get('day/teacher')
  @ApiOperation({ summary: 'Get daily schedule for a teacher' })
  @ApiQuery({ name: 'day', type: String, description: 'Date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'id', type: Number, description: 'Teacher ID' })
  @HttpCode(HttpStatus.OK)
  getTeacherDay(
    @Query('day', DatePipe) day: Date,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.scheduleService.getTeacherDay(day, id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new schedule entry' })
  @ApiBody({ type: CreateScheduleDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto)
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple schedule entries' })
  @ApiBody({ type: [CreateScheduleDto] })
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() dtos: CreateScheduleDto[]) {
    return this.scheduleService.createMany(dtos)
  }
}
