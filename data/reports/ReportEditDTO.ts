import { IsDefined } from "class-validator";
import { IsUserIdExisting } from "./validators/IsUserIdExisting";
import { ReportDTO } from "./ReportDTO";
import { IsIdExisting } from "./validators/IsIdExisting";

export class ReportEditDTO {

    private static readonly ID_NOT_DEFINED_MESSAGE: string = "Report ID is not defined!";
    private static readonly ID_NOT_EXISTING_MESSAGE: string = "Report ID is not existing!";

    @IsDefined({
        message: ReportEditDTO.ID_NOT_DEFINED_MESSAGE
    })
    @IsIdExisting({
        message: ReportEditDTO.ID_NOT_EXISTING_MESSAGE
    })
    private _id: number;

    @IsUserIdExisting({
        message: ReportDTO.USER_ID_NOT_EXISTING_MESSAGE
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
