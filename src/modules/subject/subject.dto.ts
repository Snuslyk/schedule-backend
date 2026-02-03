import { IsString } from 'class-validator'

export class SubjectDto {
  id: number
  name: string
  teacher: string
}

export class CreateSubjectDto {
  @IsString()
  name: string
}

export type TUpdateSubjectDto = Partial<CreateSubjectDto>
