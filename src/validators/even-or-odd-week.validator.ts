import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'EvenOrOdd', async: false })
export class EvenOrOddWeekConstraint implements ValidatorConstraintInterface {
  validate(days: any[]): Promise<boolean> | boolean {
    return Array.isArray(days) && (days.length === 7 || days.length === 14);
  }

  defaultMessage(): string {
    return 'There must be exactly 7 or 14 days'
  }
}