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
export class IsUsernameUniqueConstraint implements ValidatorConstraintInterface {
    validate(username: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise((async resolve => {
                const result = await new UsersRepository(new MysqlDatabase())
                    .isUsernameUnique(username);

                resolve(result);
            }
        ));
    }
}

export function IsUsernameUnique(validationOptions: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUsernameUniqueConstraint
        })
    }
}
