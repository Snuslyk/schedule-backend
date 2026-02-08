import { Body, Controller, Param, Post } from "@nestjs/common"
import { ReplaceService } from "./replace.service"
import { CreateReplaceDto } from "./replace.dto"

@Controller("replace")
export class ReplaceController {
  constructor(private readonly replaceService: ReplaceService) {}

  @Post(":group")
  create(@Body() dto: CreateReplaceDto, @Param("group") group: string) {
    return this.replaceService.create(dto, group)
  }

  @Post(":group/bulk")
  createMany(@Body() dtos: CreateReplaceDto[], @Param("group") group: string) {
    return this.replaceService.createMany(dtos, group)
  }
}
