import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post, UseGuards,
} from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './group.dto'
import { Authorization } from '../auth/decorators/authorization.decorator'
import { IsAdmin } from '../auth/decorators/is-admin.decorator'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '../auth/guards/admin.guard'
import { JwtGuard } from '../auth/guards/auth.guard'
import { AuthorizationAdmin } from '../auth/decorators/authorization-admin.decorator'

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('id/:id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @HttpCode(HttpStatus.OK)
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.getById(id)
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get group by name' })
  @ApiParam({ name: 'name', type: String, example: '11A' })
  @HttpCode(HttpStatus.OK)
  getByName(@Param('name') name: string) {
    return this.groupService.getByName(name)
  }

  @AuthorizationAdmin()
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create new group (admin only)' })
  @ApiBody({ type: CreateGroupDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto)
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple groups' })
  @ApiBody({ type: [CreateGroupDto] })
  @HttpCode(HttpStatus.CREATED)
  createMany(@Body() dtos: CreateGroupDto[]) {
    return this.groupService.createMany(dtos)
  }

  @Delete('id/:id')
  @ApiOperation({ summary: 'Delete group by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number) {
    await this.groupService.deleteById(id)
  }

  @Delete('name/:name')
  @ApiOperation({ summary: 'Delete group by name' })
  @ApiParam({ name: 'name', type: String, example: '11A' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByName(@Param('name') name: string) {
    await this.groupService.deleteByName(name)
  }
}
