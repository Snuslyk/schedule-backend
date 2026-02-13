import { Body, Controller, HttpCode, HttpStatus, Inject, Param, Post, Query } from '@nestjs/common'
import { ReplaceService } from "./replace.service"
import { CreateReplaceDto } from "./replace.dto"
import { DatePipe } from '../../date/date.pipe'
import { isSameWeek } from '../../utils/date'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Replace')
@Controller('replace')
export class ReplaceController {
  constructor(
    private readonly replaceService: ReplaceService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post(':group')
  @ApiOperation({ summary: 'Create a replacement entry for a group' })
  @ApiParam({ name: 'group', type: String, description: 'Group name', example: '11A' })
  @ApiQuery({ name: 'thisWeek', type: String, description: 'Current week start date (YYYY-MM-DD)' })
  @ApiBody({ type: CreateReplaceDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateReplaceDto,
    @Query('thisWeek', DatePipe) thisWeek: Date,
    @Param('group') group: string
  ) {
    if (isSameWeek(thisWeek, dto.date)) {
      await this.cacheManager.del(`group_week:${group}`)
    }
    return this.replaceService.create(dto, group)
  }

  @Post(':group/bulk')
  @ApiOperation({ summary: 'Create multiple replacement entries for a group' })
  @ApiParam({ name: 'group', type: String, description: 'Group name', example: '11A' })
  @ApiQuery({ name: 'thisWeek', type: String, description: 'Current week start date (YYYY-MM-DD)' })
  @ApiBody({ type: [CreateReplaceDto] })
  @HttpCode(HttpStatus.CREATED)
  async createMany(
    @Body() dtos: CreateReplaceDto[],
    @Query('thisWeek', DatePipe) thisWeek: Date,
    @Param('group') group: string
  ) {
    if (dtos.some(dto => isSameWeek(thisWeek, dto.date))) {
      await this.cacheManager.del(`group_week:${group}`)
    }
    return this.replaceService.createMany(dtos, group)
  }
}
