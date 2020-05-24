import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { database } from "../../server";
import { ReportsRepository } from "../../repositories/ReportsRepository";

@ValidatorConstraint({async: true})
export class IsReportIdExistingConstraint implements ValidatorConstraintInterface {
    public validate(id: number, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise(async (resolve) => {
            if (!id) {
                resolve(true);
            }

            const result = await new ReportsRepository(database)
                .findById(id);

            resolve(!!result);
        });
    }
}

export function IsReportIdExisting(validationOptions: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsReportIdExistingConstraint
        });
    };
}
