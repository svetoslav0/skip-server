import { IsDefined } from "class-validator";
import { IsClassIdExisting } from "../validators/IsClassIdExisting";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class ClassEditDTO {

    @IsDefined({
        message: MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_DEFINED_MESSAGE
    })
    @IsClassIdExisting({
        message: MESSAGES.ERRORS.CLASSES.ID_FIELD_NOT_EXISTING_MESSAGE
    })
    private _id!: number;

    private _name!: string;

    private _ageGroup!: string;

    private _description!: string;

    constructor(id: number, reqBody: any) {
        this
            .setId(id)
            .setName(reqBody.name)
            .setAgeGroup(reqBody.ageGroup)
            .setDescription(reqBody.description);
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get ageGroup(): string {
        return this._ageGroup;
    }

    get description(): string {
        return this._description;
    }

    public setId(id: number) {
        this._id = id;
        return this;
    }

    public setName(name: string) {
        this._name = name;
        return this;
    }

    public setAgeGroup(ageGroup: string) {
        this._ageGroup = ageGroup;
        return this;
    }

    public setDescription(description: string) {
        this._description = description;
        return this;
    }
}
