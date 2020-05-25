import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { database } from "../../server";
import { UsersRepository } from "../../repositories/UsersRepository";

@ValidatorConstraint({async: true})
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
    public validate(email: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise((async (resolve) => {
                const result = await new UsersRepository(database)
                    .isEmailUnique(email);

                resolve(result);
            }
        ));
    }
}

export function IsEmailUnique(validationOptions: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailUniqueConstraint
        });
    };
}
