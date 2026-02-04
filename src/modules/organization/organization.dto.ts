import { IsNumber, IsString } from 'class-validator'

export class OrganizationDto {
  id: number
  name: string
  number: number
}

export class CreateOrganizationDto {
  @IsString()
  name: string
  @IsNumber()
  number: number
}