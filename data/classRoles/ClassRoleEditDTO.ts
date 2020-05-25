import { IsDefined } from "class-validator";
import { IsClassRoleIdExisting } from "../validators/IsClassRoleIdExisting";
import { IsNumber } from "../validators/IsNumber";
import { IsNumberPositiveOrZero } from "../validators/IsNumberPositiveOrZero";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class ClassRoleEditDTO {

    @IsDefined({
        message: MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsClassRoleIdExisting({
        message: MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _id!: number;

    private _name!: string;

    @IsNumber({
        message: MESSAGES.ERRORS.CLASS_ROLES.PAYMENT_FIELD_NOT_NUMERIC_MESSAGE
    })
    @IsNumberPositiveOrZero({
        message: MESSAGES.ERRORS.CLASS_ROLES.PAYMENT_FIELD_IS_NEGATIVE_MESSAGE
    })
    private _paymentPerHour!: number;

    private _description!: string;

    constructor(id: number, reqBody: any) {
        this
            .setId(id)
            .setName(reqBody.name)
            .setPaymentPerHour(reqBody.paymentPerHour)
            .setDescription(reqBody.description);
    }

    get id(): number {
        return this._id;
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

    public setId(id: number): this {
        this._id = id;
        return this;
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
