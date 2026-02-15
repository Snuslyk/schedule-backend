import { IsNumber } from 'class-validator'

export class SlotDto {
  id?: number
  start: number
  end: number
  dayId?: number
}

export class CreateSlotDto {
  @IsNumber()
  start: number

  @IsNumber()
  end: number
}
