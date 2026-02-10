import { IsString } from "class-validator"

export class GroupDto {
  id?: number
  name?: string

  //schedule?: ScheduleDto | null
}

export class CreateGroupDto {
  @IsString()
  name: string

  //@IsOptional()
  //@ValidateNested()
  //@Type(() => ScheduleDto)
  //schedule?: ScheduleDto
}
