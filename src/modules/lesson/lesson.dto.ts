import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class LessonDto {
  id?: number
  classroom: string
  slotNumber: number
  slotLength: number
  isAvailable: boolean
  teacher: { name: string }
  subject: { name: string }
}

export class CreateLessonDto {
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