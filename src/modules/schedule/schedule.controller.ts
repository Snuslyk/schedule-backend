import {
  Body,
  Controller,
  Get, HttpCode, HttpStatus,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { ScheduleService } from "./schedule.service"
import { DatePipe } from "../../date/date.pipe"
import { CreateScheduleDto } from "./schedule.dto"
import { ModePipe } from "./mode/mode.pipe"

@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get("week/group")
  getGroupWeek(
    @Query("thisWeek", DatePipe) thisWeek: Date,
    @Query("week", DatePipe) week: Date,
    @Query("group") group: string,
    @Query("mode", ModePipe) mode: "parity" | "other",
  ) {
    return this.scheduleService.getGroupWeek(thisWeek, week, group, mode)
  }

  @Get("day/group")
  getParityGroupDay(
    @Query("thisDay", DatePipe) thisDay: Date,
    @Query("day", DatePipe) day: Date,
    @Query("group") group: string,
    @Query("mode", ModePipe) mode: "parity" | "other",
  ) {
    return this.scheduleService.getGroupDay(thisDay, day, group, mode)
  }

  @Get("week/teacher")
  getTeacherWeek(
    @Query("thisWeek", DatePipe) thisWeek: Date,
    @Query("week", DatePipe) week: Date,
    @Query("id", ParseIntPipe) id: number,
  ) {
    return this.scheduleService.getTeacherWeek(thisWeek, week, id)
  }

  @Get("day/teacher")
  getTeacherDay(
    @Query("thisDay", DatePipe) thisDay: Date,
    @Query("day", DatePipe) day: Date,
    @Query("id", ParseIntPipe) id: number,
  ) {
    return this.scheduleService.getTeacherDay(thisDay, day, id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto)
  }

  @Post("bulk")
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() dtos: CreateScheduleDto[]) {
    return this.scheduleService.createMany(dtos)
  }
}
