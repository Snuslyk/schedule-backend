import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ModePipe implements PipeTransform {
  transform(value: string) {
    if (value === 'parity' || value === 'other') return value
    throw new BadRequestException("Mode must be \"parity\" or \"other\"")
  }
}
