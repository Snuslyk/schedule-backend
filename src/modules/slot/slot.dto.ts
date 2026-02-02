import { IsNumber } from 'class-validator';

export class SlotDto {
  id: number
  start: number
  end: number
}

export class SlotCreateDto {

  @IsNumber()
  start: number

  @IsNumber()
  end: number
}
