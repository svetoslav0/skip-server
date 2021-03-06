import { IsDefined } from "class-validator";
import { IsNumber } from "../validators/IsNumber";
import { IsNumberPositiveOrZero } from "../validators/IsNumberPositiveOrZero";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class ClassRoleDTO {

    @IsDefined({
        message: MESSAGES.ERRORS.CLASS_ROLES.NAME_FIELD_NOT_DEFINED_MESSAGE
    })
    private _name!: string;

    @IsDefined({
        message: MESSAGES.ERRORS.CLASS_ROLES.PAYMENT_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsNumber({
        message: MESSAGES.ERRORS.CLASS_ROLES.PAYMENT_FIELD_NOT_NUMERIC_MESSAGE
    })
    @IsNumberPositiveOrZero({
        message: MESSAGES.ERRORS.CLASS_ROLES.PAYMENT_FIELD_IS_NEGATIVE_MESSAGE
    })
    private _paymentPerHour!: number;

    private _description!: string;

    constructor(reqBody: any) {
        this
            .setName(reqBody.name)
            .setPaymentPerHour(reqBody.paymentPerHour)
            .setDescription(reqBody.description);
    }

    get name(): string {
        return this._name;
    }

    get paymentPerHour(): number {
        return this._paymentPerHour;
    }

    get description(): string {
        return this._description;
    }

    public setName(name: string): this {
        this._name = name;
        return this;
    }

    public setPaymentPerHour(payment: number): this {
        this._paymentPerHour = payment;
        return this;
    }

    public setDescription(description: string): this {
        this._description = description;
        return this;
    }
}
