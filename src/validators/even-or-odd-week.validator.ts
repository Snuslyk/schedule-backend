import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator"

@ValidatorConstraint({ name: "EvenOrOdd", async: false })
export class EvenOrOddWeekConstraint implements ValidatorConstraintInterface {
  validate(days: any[]): Promise<boolean> | boolean {
    return Array.isArray(days) && (days.length === 7)
  }

  defaultMessage(): string {
    return "There must be exactly 7"
  }
}
