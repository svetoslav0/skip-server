import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { database } from "../../server";
import { ClassesRepository } from "../../repositories/ClassesRepository";

@ValidatorConstraint({async: true})
export class IsClassIdExistingConstraint implements ValidatorConstraintInterface {
    public validate(id: number, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise(async (resolve) => {
            if (!id) {
                resolve(true);
            }

            const result = await new ClassesRepository(database)
                .findById(id);

            resolve(!!result);
        });
    }
}

export function IsClassIdExisting(validationOptions: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsClassIdExistingConstraint
        });
    };
}
