import { IsDefined } from "class-validator";
import { ClassesDTO } from "./ClassesDTO";
import {IsClassIdExisting} from "../validators/IsClassIdExisting";


export class ClassesEditDTO {

    private static readonly CLASS_ID_NOT_DEFINED: string = "Class ID is not provided!";
    private static readonly CLASS_ID_NOT_EXISTING: string = "The provided class ID does not exist!";

    @IsDefined({
        message: ClassesEditDTO.CLASS_ID_NOT_DEFINED
    })
    @IsClassIdExisting({
        message: ClassesEditDTO.CLASS_ID_NOT_EXISTING
    })
    private _id!: number;

    @IsDefined({
        message: ClassesDTO.NAME_NOT_DEFINED_MESSAGE
    })
    private _name!: string;

    private _ageGroup!: string;

    constructor(id: number, reqBody: any) {
        this
            .setId(id)
            .setName(reqBody.name)
            .setAgeGroup(reqBody.ageGroup);
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
}
