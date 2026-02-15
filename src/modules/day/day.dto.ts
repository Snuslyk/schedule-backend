import { IsArray, ValidateNested } from 'class-validator'
import { CreateLessonDto, LessonDto } from '../lesson/lesson.dto'
import { CreateSlotDto, SlotDto } from '../slot/slot.dto'
import { Type } from 'class-transformer'
import { WeekTemplateDto } from '../week-template/week-template.dto'

export class DayDto {
  id?: number
  lessons?: LessonDto[]
  slots?: SlotDto[]
  weekTemplate?: WeekTemplateDto
}

export class CreateDayDto {
  //@IsNumber()
  //weekTemplateId: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  lessons: CreateLessonDto[] = []

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSlotDto)
  slots: CreateSlotDto[] = []
}
