import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ScheduleService } from './schedule.service';
import { DatePipe } from '../../date/date.pipe'
import { CreateScheduleDto } from './schedule.dto'
import { ModePipe } from './mode/mode.pipe'

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('week/group')
  getGroupWeek(@Query('start', DatePipe) start: Date, @Query('group') group: string, @Query('mode', ModePipe) mode: 'parity' | 'other') {
    return this.scheduleService.getGroupWeek(start, group, mode)
  }

  @Get('day/group')
  getParityGroupDay(@Query('date', DatePipe) date: Date, @Query('group') group: string, @Query('mode', ModePipe) mode: 'parity' | 'other') {
    return this.scheduleService.getGroupDay(date, group, mode)
  }

  @Post()
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto)
  }
}
