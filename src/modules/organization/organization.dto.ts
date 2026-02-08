import { IsNumber, IsString } from "class-validator"

export class OrganizationDto {
  id: number
  name: string
  shortName: string
}

export class CreateOrganizationDto {
  @IsString()
  name: string
  @IsNumber()
  shortName: string
}
