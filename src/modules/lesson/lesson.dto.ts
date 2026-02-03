import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class LessonDto {
  id: number
  classroom: string
  slotNumber: number
  slotLength: number
  isAvailable: boolean
  teacherId: number
  subjectId: number
}

export class LessonCreateDto {
  @IsString()
  classroom: string

  @IsNumber()
  slotNumber: number

  @IsNumber()
  slotLength: number

  @IsBoolean()
  isAvailable: boolean

  @IsNumber()
  teacherId: number

  @IsNumber()
  subjectId: number
}