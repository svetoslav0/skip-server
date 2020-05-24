import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({async: true})
export class MinimumLength implements ValidatorConstraintInterface {
    public validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        if (!value) {
            return true;
        }

        const maxLength: number = validationArguments?.constraints[0];

        return value.length >= maxLength;
    }
}
