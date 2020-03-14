import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { UserDTO } from "../UserDTO";


@ValidatorConstraint({async: true})
export class UsernameMinLengthConstraint implements ValidatorConstraintInterface {
    validate(username: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        let result: boolean = true;

        if (username) {
            result = username.length >= UserDTO.MIN_USERNAME_LENGTH;
        }

        return result;
    }
}

export function UsernameMinLength(validationOptions: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UsernameMinLengthConstraint
        })
    }
}
