// week-template.dto.ts
import { IsArray, IsEnum, Validate, ValidateNested } from 'class-validator'
import { WeekType } from '../../../generated/prisma/enums'
import { CreateDayDto, DayDto } from '../day/day.dto'
import { Type } from 'class-transformer'
import { EvenOrOddWeekConstraint } from '../../validators/even-or-odd-week.validator'
import { ScheduleDto } from '../schedule/schedule.dto'
import { ApiProperty } from '@nestjs/swagger'

export class WeekTemplateDto {
  id?: number
  type?: WeekType
  days?: DayDto[]
  schedule?: ScheduleDto
}

export class CreateWeekTemplateDto {
  @ApiProperty({
    description: 'Type of the week',
    enum: WeekType,
    example: WeekType.OTHER,
  })
  @IsEnum(WeekType)
  type: WeekType

  @ApiProperty({
    description: 'Array of days in the week template',
    type: [CreateDayDto],
    example: [
      {
        lessons: [
          {
            classroom: '405',
            slotNumber: 1,
            slotLength: 2,
            isAvailable: true,
            teacherId: 1,
            subjectId: 1,
          },
          {
            classroom: '304',
            slotNumber: 3,
            slotLength: 1,
            isAvailable: true,
            teacherId: 9,
            subjectId: 7,
          },
        ],
        slots: [
          { start: 480, end: 520 },
          { start: 530, end: 570 },
          { start: 580, end: 620 },
        ],
      },
      {
        lessons: [
          {
            classroom: '212',
            slotNumber: 1,
            slotLength: 2,
            isAvailable: true,
            teacherId: 8,
            subjectId: 3,
          },
        ],
        slots: [
          { start: 480, end: 520 },
          { start: 530, end: 570 },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDayDto)
  @Validate(EvenOrOddWeekConstraint)
  days: CreateDayDto[]
}
