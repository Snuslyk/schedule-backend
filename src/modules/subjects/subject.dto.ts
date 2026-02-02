import { IsNumber, IsString } from 'class-validator'

export class CreateSubjectsDto {
  @IsString()
  name: string
  @IsString()
  teacher: string
  @IsNumber()
  number: number
}

export type TUpdateSubjectsDto = Partial<CreateSubjectsDto>
