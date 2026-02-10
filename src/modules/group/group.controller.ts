import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { GroupService } from "./group.service"
import { CreateGroupDto } from "./group.dto"
import { Authorization } from '../auth/decorators/authorization.decorator'
import { IsAdmin } from '../auth/decorators/is-admin.decorator'

@Controller("group")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get("id/:id")
  getById(@Param("id", ParseIntPipe) id: number) {
    return this.groupService.getById(id)
  }

  @Get("name/:name")
  getByName(@Param("name") name: string) {
    return this.groupService.getByName(name)
  }

  @Authorization()
  @IsAdmin()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto)
  }

  @Post("bulk")
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() dtos: CreateGroupDto[]) {
    return this.groupService.createMany(dtos)
  }

  @Delete("id/:id")
  @HttpCode(204)
  async deleteById(@Param("id", ParseIntPipe) id: number) {
    await this.groupService.deleteById(id)
  }

  @Delete("name/:name")
  @HttpCode(204)
  async deleteByName(@Param("name") name: string) {
    await this.groupService.deleteByName(name)
  }
}
