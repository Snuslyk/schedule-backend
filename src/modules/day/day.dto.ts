import { IsArray, ValidateNested } from 'class-validator'
import { CreateLessonDto, LessonDto } from '../lesson/lesson.dto'
import { CreateSlotDto, SlotDto } from '../slot/slot.dto'
import { Type } from 'class-transformer'

export class DayDto {
  id?: number
  lessons: LessonDto[]
  slots: SlotDto[]
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