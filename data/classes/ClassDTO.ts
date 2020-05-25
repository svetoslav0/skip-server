import { IsDefined } from "class-validator";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class ClassDTO {

    @IsDefined({
        message: MESSAGES.ERRORS.CLASSES.NAME_FIELD_NOT_DEFINED_MESSAGE
    })
    private _name!: string;

    private _ageGroup!: string;

    private _description!: string;

    constructor(reqBody: any) {
        this
            .setName(reqBody.name)
            .setAgeGroup(reqBody.ageGroup)
            .setDescription(reqBody.description);
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
