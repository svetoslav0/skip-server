import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint()
export class MaximumLength implements ValidatorConstraintInterface {
    public validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        if (!value) {
            return true;
        }

        const maxLength: number = validationArguments?.constraints[0];

        return value.length <= maxLength;
    }
}
