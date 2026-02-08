// week-template.dto.ts
import { IsArray, IsEnum, Validate, ValidateNested } from "class-validator"
import { WeekType } from "../../../generated/prisma/enums"
import { CreateDayDto, DayDto } from "../day/day.dto"
import { Type } from "class-transformer"
import { EvenOrOddWeekConstraint } from "../../validators/even-or-odd-week.validator"
import { ScheduleDto } from "../schedule/schedule.dto"

export class WeekTemplateDto {
  id?: number
  type?: WeekType
  days?: DayDto[]
  schedule?: ScheduleDto
}

export class CreateWeekTemplateDto {
  @IsEnum(WeekType)
  type: WeekType

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDayDto)
  @Validate(EvenOrOddWeekConstraint)
  days: CreateDayDto[]
}
