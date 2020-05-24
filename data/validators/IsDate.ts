import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint()
export class IsDate implements ValidatorConstraintInterface {
    public validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        if (!value) {
            return true;
        }

        return !isNaN(value) && value instanceof Date;
    }
}
