import { IsNotEmpty, IsString } from 'class-validator'
import { LessonDto } from '../lesson/lesson.dto'
import { ApiProperty } from '@nestjs/swagger'

export class TeacherDto {
  id?: number
  name: string
  lessons?: LessonDto[]
}

export class CreateTeacherDto {
  @ApiProperty({
    description: 'Name of the teacher',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string
}
