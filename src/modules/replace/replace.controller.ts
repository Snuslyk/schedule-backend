import { Body, Controller, Param, Post } from '@nestjs/common'
import { ReplaceService } from './replace.service';
import { ReplaceCreateDto } from './replace.dto'

@Controller('replace')
export class ReplaceController {
  constructor(private readonly replaceService: ReplaceService) {}

  @Post(':group')
  create(@Body() dto: ReplaceCreateDto, @Param('group') group: string) {
    return this.replaceService.create(dto, group)
  }
}
