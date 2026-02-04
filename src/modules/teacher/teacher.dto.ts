import { IsString } from 'class-validator'
import { LessonDto } from '../lesson/lesson.dto'

export class TeacherDto {
  id: number;
  name: string
  lessons: LessonDto[];
}

export class CreateTeacherDto {
  @IsString()
  name: string
}
