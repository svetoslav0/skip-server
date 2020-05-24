import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint()
export class IsNumberPositiveOrZeroConstraint implements ValidatorConstraintInterface {
    public validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        if (!value || isNaN(+value)) {
            return true;
        }

        return +value >= 0;
    }
}

export function IsNumberPositiveOrZero(validationOptions: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNumberPositiveOrZeroConstraint
        });
    };
}
