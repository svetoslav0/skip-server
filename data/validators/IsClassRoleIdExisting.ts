import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { database } from "../../server";
import { ClassRolesRepository } from "../../repositories/ClassRolesRepository";

@ValidatorConstraint({async: true})
export class IsClassRoleIdExistingConstraint implements ValidatorConstraintInterface {
    public validate(id: number, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise(async (resolve) => {
            if (!id) {
                resolve(true);
            }

            const result = await new ClassRolesRepository(database)
                .findById(id);

            resolve(!!result);
        });
    }
}

export function IsClassRoleIdExisting(validationOptions: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsClassRoleIdExistingConstraint
        });
    };
}
