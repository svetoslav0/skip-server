import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import {UserDTO} from "../UserDTO";



@ValidatorConstraint({async: false})
export class UsernameMaxLengthConstraint implements ValidatorConstraintInterface {
    validate(username: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        let result: boolean = true;

        if (username) {
            result = username.length <= UserDTO.MAX_USERNAME_LENGTH;
        }

        return result;
    }
}

export function UsernameMaxLength(validationOptions: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UsernameMaxLengthConstraint
        })
    }
}
