import { IsNumber, IsDate, IsString, IsBoolean } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'

export class ReplaceDto {
  id?: number
  date: Date
  slotNumber: number
  classroom: string
  teacher: { name: string }
  subject: { name: string }
  isAvailable: boolean
}

export class CreateReplaceDto {
  @ApiProperty({
    description: 'Date of the replacement',
    example: '2026-02-15T08:30:00.000Z',
    type: String,
    format: 'date-time'
  })
  @IsDate()
  date: Date

  @ApiProperty({
    description: 'Slot number of the replacement',
    example: 2,
    type: Number
  })
  @IsNumber()
  slotNumber: number

  @ApiProperty({
    description: 'Classroom where the replacement will occur',
    example: '101',
    type: String
  })
  @IsString()
  classroom: string

  @ApiProperty({
    description: 'Indicates whether the slot is available',
    example: true,
    type: Boolean
  })
  @IsBoolean()
  isAvailable: boolean

  @ApiProperty({
    description: 'ID of the teacher for this replacement',
    example: 5,
    type: Number
  })
  @IsNumber()
  teacherId: number

  @ApiProperty({
    description: 'ID of the subject for this replacement',
    example: 3,
    type: Number
  })
  @IsNumber()
  subjectId: number
}
