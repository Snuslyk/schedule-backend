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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('Teacher')
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiBody({ type: CreateTeacherDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto)
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple teachers' })
  @ApiBody({ type: [CreateTeacherDto] })
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() createTeacherDtos: CreateTeacherDto[]) {
    return this.teacherService.createMany(createTeacherDtos)
  }

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.teacherService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Teacher ID', example: 1 })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.findOne(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Teacher ID', example: 1 })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id)
  }
}
