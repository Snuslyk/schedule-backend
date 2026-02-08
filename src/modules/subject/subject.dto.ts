import { IsString } from 'class-validator'
import { TeacherDto } from '../teacher/teacher.dto'

export class SubjectDto {
  id?: number
  name: string
  teachers?: TeacherDto[]
}

export class CreateSubjectDto {
  @IsString()
  name: string
}

export type TUpdateSubjectDto = Partial<CreateSubjectDto>
