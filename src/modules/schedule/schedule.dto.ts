import { IsDate, IsNumber } from 'class-validator';
import { ReplaceDto } from '../replace/replace.dto'
import { WeekTemplateDto } from '../week-template/week-template.dto'

export class ScheduleDto {
  id?: number;
  start: Date;
  end: Date;
  weekTemplate: WeekTemplateDto[];
  replaces: ReplaceDto[];
}

export class ScheduleCreateDto {
  @IsDate()
  start: Date;

  @IsDate()
  end: Date;

  @IsNumber()
  groupId: number;
}
