import { IsDefined } from "class-validator";
import { IsClassRoleIdExisting } from "../validators/IsClassRoleIdExisting";
import { ClassRoleDTO } from "./ClassRoleDTO";
import { IsNumber } from "../validators/IsNumber";
import { IsNumberPositiveOrZero } from "../validators/IsNumberPositiveOrZero";

export class ClassRoleEditDTO {

    private static readonly CLASS_ROLE_ID_NOT_DEFINED: string = "Class Role ID is not defined!";
    private static readonly CLASS_ROLE_ID_NOT_EXISTING: string = "The provided Class Role ID does not exist!";

    @IsDefined({
        message: ClassRoleEditDTO.CLASS_ROLE_ID_NOT_DEFINED
    })
    @IsClassRoleIdExisting({
        message: ClassRoleEditDTO.CLASS_ROLE_ID_NOT_EXISTING
    })
    private _id!: number;

    private _name!: string;

    @IsNumber({
        message: ClassRoleDTO.PAYMENT_NOT_NUMBER_MESSAGE
    })
    @IsNumberPositiveOrZero({
        message: ClassRoleDTO.PAYMENT_NOT_POSITIVE_OR_ZERO_MESSAGE
    })
    private _paymentPerHour!: number;

    constructor(id: number, reqBody: any) {
        this
            .setId(id)
            .setName(reqBody.name)
            .setPaymentPerHour(reqBody.paymentPerHour);
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
}
