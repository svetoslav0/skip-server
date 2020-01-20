import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { MysqlDatabase } from "../../../database/MysqlDatabase";
import { UsersModel } from "../../../models/UsersModel";

@ValidatorConstraint({async: true})
export class IsUsernameUniqueConstraint implements ValidatorConstraintInterface {
    validate(username: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise((async resolve => {
                const result = await new UsersModel(new MysqlDatabase())
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