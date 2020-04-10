import { MysqlDatabase } from "../database/MysqlDatabase";
import { ClassRoleDTO } from "../data/classRoles/ClassRoleDTO";

export class ClassRolesModel {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * This method
     * @param classRole
     */
    public async add(classRole: ClassRoleDTO) {
        const result = await this.db.query(`
            INSERT INTO
                class_roles (
                    name,
                    payment_per_hour
                )
             VALUES (?, ?)
        `, [
            classRole.name,
            classRole.paymentPerHour
        ]);

        return result.insertId;
    }
}
