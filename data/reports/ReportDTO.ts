import { IsDefined } from "class-validator";
import { IsUserIdExisting } from "../validators/IsUserIdExisting";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class ReportDTO {
    @IsDefined({
        message: MESSAGES.ERRORS.REPORTS.USER_ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsUserIdExisting({
        message: MESSAGES.ERRORS.REPORTS.USER_ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _userId: number;

    @IsDefined({
        message: MESSAGES.ERRORS.REPORTS.NAME_FIELD_NOT_DEFINED_MESSAGE
    })
    private _name: string;

    private _description!: string;

    constructor(userId: number, requestBody: any) {
        this._userId = userId;
        this._name = requestBody.name;
        this._description = requestBody.description;
    }

    get userId(): number {
        return this._userId;
    }

    set userId(userId: number) {
        this._userId = userId;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
