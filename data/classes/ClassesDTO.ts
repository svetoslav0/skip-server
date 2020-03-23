import { IsDefined } from "class-validator";

export class ClassesDTO {

    public static readonly NAME_NOT_DEFINED_MESSAGE: string = "Field 'name' is not defined!";

    @IsDefined({
        message: ClassesDTO.NAME_NOT_DEFINED_MESSAGE
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
