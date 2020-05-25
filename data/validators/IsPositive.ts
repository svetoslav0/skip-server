import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint()
export class IsPositive implements ValidatorConstraintInterface {
    public validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        if (!value) {
            return true;
        }

        const includeZero: boolean = validationArguments?.constraints
            ? validationArguments.constraints[0]
            : false;

        if (includeZero) {
            return +value >= 0;
        }

        return +value > 0;
    }
}
