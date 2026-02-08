import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class ConceptionPipe implements PipeTransform {
  transform(value: string) {
    const val = parseInt(value)
    if (isNaN(val)) {
      throw new BadRequestException("Validation failed")
    }
    return val
  }
}
