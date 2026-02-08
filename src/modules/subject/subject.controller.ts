import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { SubjectService } from "./subject.service"
import { ConceptionPipe } from "../../conception/conception.pipe"
import { ConceptionGuard } from "../../conception/conception.guard"
import { ConceptionInterceptor } from "../../conception/conception.interceptor"
import { CreateSubjectDto } from "./subject.dto"

@Controller("subject")
@UseInterceptors(ConceptionInterceptor)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @UseGuards(ConceptionGuard)
  findAll(@Query("pageNumber", ConceptionPipe) pageNumber: number) {
    console.log(pageNumber)
    return this.subjectService.findAll()
  }

  @Post()
  //@UseGuards(ConceptionGuard)
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectService.create(dto)
  }

  @Post("bulk")
  //@UseGuards(ConceptionGuard)
  createMany(@Body() dtos: CreateSubjectDto[]) {
    return this.subjectService.createMany(dtos)
  }
}
