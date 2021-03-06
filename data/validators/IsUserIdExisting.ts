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
export class IsUserIdExistingConstraint implements ValidatorConstraintInterface {
    public validate(id: number, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise(async (resolve) => {
            if (!id) {
                resolve(true);
            }

            const result = await new UsersRepository(database)
                .findById(id);

            resolve(!!result);
        });
    }
}

export function IsUserIdExisting(validationOptions: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserIdExistingConstraint
        });
    };
}
