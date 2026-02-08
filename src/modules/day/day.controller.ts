import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from "@nestjs/common"
import { DayService } from "./day.service"

@Controller("day")
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.dayService.get(id)
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param("id", ParseIntPipe) id: number) {
    await this.dayService.deleteById(id)
  }
}
