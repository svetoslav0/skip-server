import { IsDefined, Validate } from "class-validator";

import { IsReportIdExisting } from "../validators/IsReportIdExisting";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { IsClassIdExisting } from "../validators/IsClassIdExisting";
import { IsClassRoleIdExisting } from "../validators/IsClassRoleIdExisting";
import { IsNumber } from "../validators/IsNumber";
import { REPOSITORIES } from "../../common/consts/REPOSITORIES";
import { IsResourceIdExisting } from "../validators/IsResourceIdExisting";
import { IsPositive } from "../validators/IsPositive";
import { IsDate } from "../validators/IsDate";

export class ReportEntityDTO {

    @IsNumber({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.REPORT_ID_FIELD_NOT_NUMERIC_MESSAGE
    })
    @IsReportIdExisting({
        message: MESSAGES.ERRORS.REPORTS.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _reportId: number;

    @IsDefined({
        message: MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsNumber({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.CLASS_ID_FIELD_NOT_NUMERIC_MESSAGE
    })
    @IsClassIdExisting({
        message: MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _classId: number;

    @IsDefined({
        message: MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsNumber({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.CLASS_ROLE_ID_FIELD_NOT_NUMERIC_MESSAGE
    })
    @IsClassRoleIdExisting({
        message: MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _classRoleId: number;

    @IsDefined({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.USER_ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsNumber({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.USER_ID_FIELD_NOT_NUMERIC_MESSAGE
    })
    @Validate(IsResourceIdExisting, [REPOSITORIES.USERS_REPOSITORY], {
        message: MESSAGES.ERRORS.USERS.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _userId: number;

    @IsDefined({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.DATE_FIELD_NOT_DEFINED_MESSAGE
    })
    @Validate(IsDate, {
        message: MESSAGES.ERRORS.REPORT_ENTITIES.DATE_FIELD_NOT_VALID_DATE_MESSAGE
    })
    private _date: Date;

    @IsDefined({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.HOURS_SPEND_FIELD_NOT_DEFINED_MESSAGE
    })
    @Validate(IsPositive, {
        message: MESSAGES.ERRORS.REPORT_ENTITIES.HOURS_SPEND_FIELD_NOT_POSITIVE_MESSAGE
    })
    private _hoursSpend: number;

    private _description!: string;

    constructor(userId: number, reqBody: any) {
        this._userId = userId;
        this._reportId = reqBody.reportId;
        this._classId = reqBody.classId;
        this._classRoleId = reqBody.classRoleId;
        this._date = new Date(reqBody.date);
        this._hoursSpend = reqBody.hoursSpend;
        this._description = reqBody.description;
    }

    get reportId(): number {
        return this._reportId;
    }

    set reportId(value: number) {
        this._reportId = value;
    }

    get classId(): number {
        return this._classId;
    }

    set classId(value: number) {
        this._classId = value;
    }

    get classRoleId(): number {
        return this._classRoleId;
    }

    set classRoleId(value: number) {
        this._classRoleId = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get hoursSpend(): number {
        return this._hoursSpend;
    }

    set hoursSpend(value: number) {
        this._hoursSpend = value;
    }

    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
