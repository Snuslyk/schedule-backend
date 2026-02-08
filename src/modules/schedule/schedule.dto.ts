import { IsDate, IsNumber } from 'class-validator';
import { ReplaceDto } from '../replace/replace.dto'
import { WeekTemplateDto } from '../week-template/week-template.dto'
import { GroupDto } from '../group/group.dto'

export class ScheduleDto {
  id?: number;
  start?: Date;
  end?: Date;
  group?: GroupDto
  weekTemplate?: WeekTemplateDto[];
  replaces?: ReplaceDto[];
}

export class CreateScheduleDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsNumber()
  groupId: number;
}
