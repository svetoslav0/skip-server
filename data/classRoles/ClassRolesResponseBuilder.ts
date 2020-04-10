import { AbstractResponseBuilder } from "../AbstractResponseBuilder";
import { IResponseBuilder } from "../IResponseBuilder";
import { IClassRolesResponseBuilder } from "./IClassRolesResponseBuilder";

export class ClassRolesResponseBuilder extends AbstractResponseBuilder implements IResponseBuilder {

    _classRoleId!: number;

    public buildResponse(): IClassRolesResponseBuilder {
        return this.buildData({
            classRoleId: this._classRoleId
        });
    }

    public setClassRoleId(id: number): this {
        this._classRoleId = id;
        return this;
    }
}
