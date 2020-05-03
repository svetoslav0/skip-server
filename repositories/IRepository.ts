import { MysqlDatabase } from "../database/MysqlDatabase";

export interface IRepositoryConstructor {
    new(db: MysqlDatabase): IRepository;
}

export interface IRepository {
    add: (resourceDTO: any) => Promise<number>;
    findById: (id: number) => Promise<any>;
    update: (resourceDTO: any) => Promise<boolean>;
    archive: (id: number) => Promise<boolean>;
}
