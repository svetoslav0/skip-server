import { AbstractResponseBuilder } from "../AbstractResponseBuilder";
import { IResponseBuilder } from "../IResponseBuilder";
import { IClassesResponseBuilder } from "./IClassesResponseBuilder";

export class ClassesResponseBuilder extends AbstractResponseBuilder implements IResponseBuilder{

    _classId!: number;

    public buildResponse(): IClassesResponseBuilder {
        return this.buildData({
            classId: this._classId
        });
    }

    public setClassId(id: number): this {
        this._classId = id;
        return this;
    }
}
