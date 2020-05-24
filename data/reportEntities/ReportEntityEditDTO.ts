import { IsDefined, Validate } from "class-validator";
import { IsResourceIdExisting } from "../validators/IsResourceIdExisting";
import { MESSAGES } from "../../common/consts/MESSAGES";
import { REPOSITORIES } from "../../common/consts/REPOSITORIES";
import { IsNumber } from "../validators/IsNumber";
import { IsPositive } from "../validators/IsPositive";
import { IsDate } from "../validators/IsDate";

export class ReportEntityEditDTO {

    @IsDefined({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @Validate(IsResourceIdExisting, [REPOSITORIES.REPORT_ENTITIES_REPOSITORY], {
        message: MESSAGES.ERRORS.REPORT_ENTITIES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _id: number;

    @IsNumber({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.REPORT_ID_FIELD_NOT_NUMERIC_MESSAGE
    })
    @Validate(IsResourceIdExisting, [REPOSITORIES.REPORTS_REPOSITORY], {
        message: MESSAGES.ERRORS.REPORTS.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _reportId: number;

    @IsNumber({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.CLASS_ID_FIELD_NOT_NUMERIC_MESSAGE
    })
    @Validate(IsResourceIdExisting, [REPOSITORIES.CLASSES_REPOSITORY], {
        message: MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _classId: number;

    @IsNumber({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.CLASS_ROLE_ID_FIELD_NOT_NUMERIC_MESSAGE
    })
    @Validate(IsResourceIdExisting, [REPOSITORIES.CLASS_ROLES_REPOSITORY], {
        message: MESSAGES.ERRORS.CLASS_ROLES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _classRoleId: number;

    @IsNumber({
        message: MESSAGES.ERRORS.REPORT_ENTITIES.USER_ID_FIELD_NOT_NUMERIC_MESSAGE
    })
    @Validate(IsResourceIdExisting, [REPOSITORIES.USERS_REPOSITORY], {
        message: MESSAGES.ERRORS.USERS.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _userId: number;

    @Validate(IsDate, {
        message: MESSAGES.ERRORS.REPORT_ENTITIES.DATE_FIELD_NOT_VALID_DATE_MESSAGE
    })
    private _date: Date;

    @Validate(IsPositive, {
        message: MESSAGES.ERRORS.REPORT_ENTITIES.HOURS_SPEND_FIELD_NOT_POSITIVE_MESSAGE
    })
    private _hoursSpend: number;

    private _description!: string;

    constructor(id: number, reqBody: any) {
        this._id = id;
        this._reportId = reqBody.reportId;
        this._classId = reqBody.classId;
        this._classRoleId = reqBody.classRoleId;
        this._userId = reqBody.userId;
        this._date = new Date(reqBody.date);
        this._hoursSpend = +reqBody.hoursSpend;
        this._description = reqBody.description;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
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

    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
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

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
