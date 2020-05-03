import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { MysqlDatabase } from "../../database/MysqlDatabase";
import { UsersRepository } from "../../repositories/UsersRepository";

@ValidatorConstraint({async: true})
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
    validate(email: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise((async resolve => {
                const result = await new UsersRepository(new MysqlDatabase())
                    .isEmailUnique(email);

                resolve(result);
            }
        ));
    }
}

export function IsEmailUnique(validationOptions: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailUniqueConstraint
        })
    }
}
