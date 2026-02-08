import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common'
import { TeacherService } from "./teacher.service"
import { CreateTeacherDto } from "./teacher.dto"

@Controller("teacher")
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto)
  }

  @Post("bulk")
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() createTeacherDtos: CreateTeacherDto[]) {
    return this.teacherService.createMany(createTeacherDtos)
  }

  @Get()
  findAll() {
    return this.teacherService.findAll()
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.teacherService.findOne(id)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.teacherService.remove(+id)
  }
}
