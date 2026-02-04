import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class DatePipe implements PipeTransform {
  transform(value: string) {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date')
    }
    return date;
  }
}
