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

    constructor(reqBody: any) {
        this._userId = reqBody.userId;
        this._name = reqBody.name;
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
}
