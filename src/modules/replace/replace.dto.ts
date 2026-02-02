import { ValidateNested, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { LessonDto } from '../lesson/lesson.dto'

export class ReplaceDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsDate()
  date: Date;

  @IsNumber()
  slotNumber: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LessonDto)
  lesson?: LessonDto;
}
