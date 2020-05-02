import { MysqlDatabase } from "../database/MysqlDatabase";

export interface IModelConstructor {
    new(db: MysqlDatabase): IModel;
}

export interface IModel {
    add: (resourceDTO: any) => Promise<number>;
    findById: (id: number) => Promise<any>;
    update: (resourceDTO: any) => Promise<boolean>;
    archive: (id: number) => Promise<boolean>;
}
