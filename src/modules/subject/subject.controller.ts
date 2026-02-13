import {
  Body,
  Controller,
  Get, HttpCode, HttpStatus,
  Post,
} from '@nestjs/common'
import { SubjectService } from "./subject.service"
import { CreateSubjectDto } from "./subject.dto"
import {
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Subject')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.subjectService.findAll()
  }

  @Post()
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiBody({ type: CreateSubjectDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectService.create(dto)
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple subjects' })
  @ApiBody({ type: [CreateSubjectDto] })
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() dtos: CreateSubjectDto[]) {
    return this.subjectService.createMany(dtos)
  }
}
