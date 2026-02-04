import { IsNumber, IsDate, IsString, IsBoolean } from 'class-validator'
import { TeacherDto } from '../teacher/teacher.dto'
import { SubjectDto } from '../subject/subject.dto'

export class ReplaceDto {
  id?: number
  date: Date
  slotNumber: number
  classroom: string
  teacher: TeacherDto
  subject: SubjectDto
  teacherId: number
  subjectId: number
  isAvailable: boolean
}

export class CreateReplaceDto {
  @IsDate()
  date: Date

  @IsNumber()
  slotNumber: number

  @IsString()
  classroom: string

  @IsBoolean()
  isAvailable: boolean

  @IsNumber()
  teacherId: number

  @IsNumber()
  subjectId: number
}
