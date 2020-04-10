import { IsDefined } from "class-validator";
import { IsNumber } from "../validators/IsNumber";
import { IsNumberPositiveOrZero } from "../validators/IsNumberPositiveOrZero";
export class ClassRoleDTO {

    private static readonly NAME_NOT_DEFINED_MESSAGE: string = "Field 'name' is not defined!";
    private static readonly PAYMENT_NOT_DEFINED_MESSAGE: string = "Field 'paymentPerHour' is not defined!";
    private static readonly PAYMENT_NOT_NUMBER_MESSAGE: string = "Field 'paymentPerHour' is not a number";
    private static readonly PAYMENT_NOT_POSITIVE_MESSAGE: string = "Field 'paymentPerHour' is not a positive number";

    @IsDefined({
        message: ClassRoleDTO.NAME_NOT_DEFINED_MESSAGE
    })
    private _name!: string;

    @IsDefined({
        message: ClassRoleDTO.PAYMENT_NOT_DEFINED_MESSAGE
    })
    @IsNumber({
        message: ClassRoleDTO.PAYMENT_NOT_NUMBER_MESSAGE
    })
    @IsNumberPositiveOrZero({
        message: ClassRoleDTO.PAYMENT_NOT_POSITIVE_MESSAGE
    })
    private _paymentPerHour!: number;

    constructor(reqBody: any) {
        this
            .setName(reqBody.name)
            .setPaymentPerHour(reqBody.paymentPerHour);
    }

    get name(): string {
        return this._name;
    }

    get paymentPerHour(): number {
        return this._paymentPerHour;
    }

    public setName(name: string): this {
        this._name = name;
        return this;
    }

    public setPaymentPerHour(payment: number): this {
        this._paymentPerHour = payment;
        return this;
    }
}
