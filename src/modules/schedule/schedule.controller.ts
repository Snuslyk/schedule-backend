import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ScheduleService } from './schedule.service';
import { DatePipe } from '../../date/date.pipe'
import { ScheduleCreateDto } from './schedule.dto'

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('week')
  getWeek(@Query('start', DatePipe) start: Date, @Query('group') group: string) {
    return this.scheduleService.getWeek(start, group)
  }

  @Post()
  create(@Body() dto: ScheduleCreateDto) {
    return this.scheduleService.create(dto)
  }
}
