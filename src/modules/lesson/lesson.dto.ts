import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class LessonDto {
  id: number
  classroom: string
  slotNumber: number
  slotLength: number
  isAvailable: boolean
}

export class LessonCreateDto {
  @IsString()
  classroom: string

  @IsNumber()
  slotNumber: number

  @IsNumber()
  slotLength: number

  @IsBoolean()
  isAvailable: boolean
}