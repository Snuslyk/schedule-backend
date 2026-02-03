import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { TeacherService } from './teacher.service';
import { TeacherCreateDto } from './teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  create(@Body() createTeacherDto: TeacherCreateDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }
}
