import { IsDefined } from "class-validator";
import { IsUserIdExisting } from "../validators/IsUserIdExisting";
import { IsReportIdExisting } from "../validators/IsReportIdExisting";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class ReportEditDTO {

    @IsDefined({
        message: MESSAGES.ERRORS.REPORTS.ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsReportIdExisting({
        message: MESSAGES.ERRORS.REPORTS.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _id: number;

    @IsUserIdExisting({
        message: MESSAGES.ERRORS.REPORTS.USER_ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _userId: number;

    private _name: string;

    constructor(id: number, reqBody: any) {
        this._id = id;
        this._userId = reqBody.userId;
        this._name = reqBody.name;
    }

    get id(): number {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get userId(): number {
        return this._userId;
    }

    set userId(userId: number) {
        this._userId = userId;
    }
}
