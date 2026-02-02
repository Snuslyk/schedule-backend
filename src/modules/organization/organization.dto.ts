import { IsNumber, IsString } from 'class-validator'

export class OrganizationDto {
  @IsString()
  name: string
  @IsNumber()
  number: number
}