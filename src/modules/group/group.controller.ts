import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common'
import { GroupService } from './group.service';
import { CreateGroupDto } from './group.dto'

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('id/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.getById(id)
  }

  @Get('name/:name')
  getByName(@Param('name') name: string) {
    return this.groupService.getByName(name)
  }

  @Post()
  create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto)
  }

  @Post('bulk')
  createMany(@Body() dtos: CreateGroupDto[]) {
    return this.groupService.createMany(dtos)
  }

  @Delete('id/:id')
  @HttpCode(204)
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.groupService.deleteById(id)
  }

  @Delete('name/:name')
  @HttpCode(204)
  async deleteByName(@Param('name') name: string) {
    await this.groupService.deleteByName(name)
  }
}
