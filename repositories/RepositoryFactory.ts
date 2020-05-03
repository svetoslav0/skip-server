import { MysqlDatabase } from "../database/MysqlDatabase";
import { IRepository } from "./IRepository";
import { REPOSITORIES } from "../common/consts/REPOSITORIES";
import { UsersRepository } from "./UsersRepository";
import { ReportsRepository } from "./ReportsRepository";
import { ClassesRepository } from "./ClassesRepository";
import { ClassRolesRepository } from "./ClassRolesRepository";
import { ReportEntitiesRepository } from "./ReportEntitiesRepository";

export class RepositoryFactory {
    public createRepository(type: string, db: MysqlDatabase): IRepository {
        switch (type) {
            case REPOSITORIES.USERS_REPOSITORY:
                return new UsersRepository(db);
            case REPOSITORIES.REPORTS_REPOSITORY:
                return new ReportsRepository(db);
            case REPOSITORIES.CLASSES_REPOSITORY:
                return new ClassesRepository(db);
            case REPOSITORIES.CLASS_ROLES_REPOSITORY:
                return new ClassRolesRepository(db);
            case REPOSITORIES.REPORT_ENTITIES_REPOSITORY:
                return new ReportEntitiesRepository(db);
            default:
                throw new Error("Trying to init unknown repository in Repository Factory!");
        }
    }
}
