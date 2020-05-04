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
    validate(id: number, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise(async resolve => {
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
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsClassRoleIdExistingConstraint
        })
    }
}
