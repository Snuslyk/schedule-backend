import { IsNumber, IsDate, IsString, IsBoolean } from 'class-validator'

export class ReplaceDto {
  id?: number
  date: Date
  slotNumber: number
  classroom: string
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
