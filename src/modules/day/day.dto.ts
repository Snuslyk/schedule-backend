import { IsArray, ValidateNested } from 'class-validator'
import { LessonCreateDto, LessonDto } from '../lesson/lesson.dto'
import { SlotCreateDto, SlotDto } from '../slot/slot.dto'
import { Type } from 'class-transformer'

export class DayDto {
  id: number
  lesson: LessonDto[]
  slot: SlotDto[]
}

export class DayCreateDto {

  //@IsNumber()
  //weekTemplateId: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonCreateDto)
  lessons: LessonCreateDto[] = []

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotCreateDto)
  slots: SlotCreateDto[] = []

}