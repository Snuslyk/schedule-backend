import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GroupDto {
  id?: number
  name?: string

  //schedule?: ScheduleDto | null
}

export class CreateGroupDto {
  @ApiProperty({
    description: 'The name of the group',
    example: '11A',
  })
  @IsString()
  @IsNotEmpty()
  name: string
}
