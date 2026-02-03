// week-template.dto.ts
import { IsArray, IsEnum, Validate, ValidateNested } from 'class-validator'
import { WeekType } from '../../../generated/prisma/enums'
import { DayCreateDto, DayDto } from '../day/day.dto'
import { Type } from 'class-transformer'
import { EvenOrOddWeekConstraint } from '../../validators/even-or-odd-week.validator'

export class WeekTemplateDto {
  id?: number
  type: WeekType
  days: DayDto[]
}

export class WeekTemplateCreateDto {
  @IsEnum(WeekType)
  type: WeekType

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayCreateDto)
  @Validate(EvenOrOddWeekConstraint)
  days: DayCreateDto[]
}
