import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { TeacherDto } from '../teacher/teacher.dto'
import { SubjectDto } from '../subject/subject.dto'

export class LessonDto {
  id?: number
  classroom: string
  slotNumber: number
  slotLength: number
  isAvailable: boolean
  teacher: TeacherDto
  subject: SubjectDto
  teacherId: number
  subjectId: number
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