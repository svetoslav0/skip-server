import { IsDefined } from "class-validator";
import { MESSAGES } from "../../common/consts/MESSAGES";

export class ClassDTO {

    @IsDefined({
        message: MESSAGES.ERRORS.CLASSES.NAME_FIELD_NOT_DEFINED_MESSAGE
    })
    private _name!: string;

    private _ageGroup!: string;

    constructor(reqBody: any) {
        this
            .setName(reqBody.name)
            .setAgeGroup(reqBody.ageGroup);
    }

    get name(): string {
        return this._name;
    }

    get ageGroup(): string {
        return this._ageGroup;
    }

    public setName(name: string) {
        this._name = name;
        return this;
    }

    public setAgeGroup(ageGroup: string) {
        this._ageGroup = ageGroup;
        return this;
    }
}
