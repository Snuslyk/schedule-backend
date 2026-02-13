import { IsNotEmpty, IsString } from 'class-validator'
import { TeacherDto } from "../teacher/teacher.dto"
import { ApiProperty } from '@nestjs/swagger'

export class SubjectDto {
  id?: number
  name: string
  teachers?: TeacherDto[]
}

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Name of the subject',
    example: 'Mathematics'
  })
  @IsString()
  @IsNotEmpty()
  name: string
}

export type TUpdateSubjectDto = Partial<CreateSubjectDto>
