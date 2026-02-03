import { IsNumber, IsDate, IsString, IsBoolean } from 'class-validator'
import { LessonDto } from '../lesson/lesson.dto'

export class ReplaceDto {
  id: number;
  date: Date;
  slotNumber: number;
  lesson: LessonDto;
}

export class ReplaceCreateDto {
  @IsDate()
  date: Date;

  @IsNumber()
  slotNumber: number;

  @IsString()
  classroom: string

  @IsBoolean()
  isAvailable: boolean

  @IsNumber()
  teacherId: number

  @IsNumber()
  subjectId: number
}
