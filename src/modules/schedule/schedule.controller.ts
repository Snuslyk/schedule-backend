import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ScheduleService } from './schedule.service';
import { DatePipe } from '../../date/date.pipe'
import { CreateScheduleDto } from './schedule.dto'

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('week/group')
  getParityGroupWeek(@Query('start', DatePipe) start: Date, @Query('group') group: string) {
    return this.scheduleService.getParityGroupWeek(start, group)
  }

  @Post()
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto)
  }
}
