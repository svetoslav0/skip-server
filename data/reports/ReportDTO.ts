import { IsDefined } from "class-validator";
import { IsUserIdExisting } from "../validators/IsUserIdExisting";

export class ReportDTO {

    private static readonly USER_ID_NOT_DEFINED_MESSAGE: string = "Field 'userId' is required!";
    private static readonly NAME_NOT_DEFINED_MESSAGE: string = "Field 'name' is required!";

    public static readonly USER_ID_NOT_EXISTING_MESSAGE: string = "The given 'userId' does not exist!";

    @IsDefined({
        message: ReportDTO.USER_ID_NOT_DEFINED_MESSAGE
    })
    @IsUserIdExisting({
        message: ReportDTO.USER_ID_NOT_EXISTING_MESSAGE
    })
    private _userId: number;

    @IsDefined({
        message: ReportDTO.NAME_NOT_DEFINED_MESSAGE
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
