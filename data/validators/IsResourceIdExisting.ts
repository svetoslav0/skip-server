import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { IModel } from "../../models/IModel";
import { MysqlDatabase } from "../../database/MysqlDatabase";
import { ModelFactory } from "../../models/ModelFactory";

@ValidatorConstraint({async: true})
export class IsResourceIdExisting implements ValidatorConstraintInterface {
    validate(id: number, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return new Promise(async resolve => {
            if (!id) {
                resolve(true);
            }

            const modelType: string = validationArguments?.constraints[0];
            const model: IModel = new ModelFactory()
                .createModel(modelType, new MysqlDatabase());

            const result = await model.findById(id);

            resolve(!!result);
        });
    }
}
