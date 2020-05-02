import { MysqlDatabase } from "../database/MysqlDatabase";
import { IModel } from "./IModel";
import { MODELS } from "../common/consts/MODELS";
import { UsersModel } from "./UsersModel";
import { ReportsModel } from "./ReportsModel";
import { ClassesModel } from "./ClassesModel";
import { ClassRolesModel } from "./ClassRolesModel";
import { ReportEntitiesModel } from "./ReportEntitiesModel";

export class ModelFactory {
    public createModel(type: string, db: MysqlDatabase): IModel {
        switch (type) {
            case MODELS.USERS_MODEL:
                return new UsersModel(db);
            case MODELS.REPORTS_MODEL:
                return new ReportsModel(db);
            case MODELS.CLASSES_MODEL:
                return new ClassesModel(db);
            case MODELS.CLASS_ROLES_MODEL:
                return new ClassRolesModel(db);
            case MODELS.REPORT_ENTITIES_MODEL:
                return new ReportEntitiesModel(db);
            default:
                throw new Error("Trying to init unknown model in Model Factory!");
        }
    }
}
