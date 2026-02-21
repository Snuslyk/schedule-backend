import { IsDate, IsEnum, IsNumber } from 'class-validator'
import { ReplaceDto } from '../replace/replace.dto'
import { WeekTemplateDto } from '../week-template/week-template.dto'
import { GroupDto } from '../group/group.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Mode } from '../../../generated/prisma/enums'

export class ScheduleDto {
  id?: number
  start?: Date
  end?: Date
  group?: GroupDto
  mode?: Mode
  weekTemplate?: WeekTemplateDto[]
  replaces?: ReplaceDto[]
}

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Start date and time of the schedule entry',
    example: '2026-02-15T08:30:00.000Z',
    type: String, // Dates в Swagger отображаются как string
    format: 'date-time',
  })
  @IsDate()
  start: Date

  @ApiProperty({
    description: 'End date and time of the schedule entry',
    example: '2026-02-15T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  end: Date

  @ApiProperty({
    description: 'Mode of the week',
    example: 'OTHER',
    type: String,
  })
  @IsEnum(Mode)
  mode: Mode

  @ApiProperty({
    description: 'ID of the group associated with this schedule entry',
    example: 1,
    type: Number,
  })
  @IsNumber()
  groupId: number
}
