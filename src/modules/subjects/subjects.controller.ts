import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { SubjectsService } from './subjects.service'
import { ConceptionPipe } from '../../conception/conception.pipe'
import { ConceptionGuard } from '../../conception/conception.guard'
import { ConceptionInterceptor } from '../../conception/conception.interceptor'
import { CreateSubjectsDto } from './subject.dto'

@Controller('subjects')
@UseInterceptors(ConceptionInterceptor)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @UseGuards(ConceptionGuard)
  findAll(@Query('pageNumber', ConceptionPipe) pageNumber: number) {
    console.log(pageNumber)
    return this.subjectsService.findAll()
  }

  @Post()
  @UseGuards(ConceptionGuard)
  async create(@Body() dto: CreateSubjectsDto) {
    return await this.subjectsService.create(dto)
  }

  //@Put()
  //@UseGuards(ConceptionGuard)
  //update(@Body() dto: CreateSubjectsDto) {
  //  return this.subjectsService.up
  //}
}
