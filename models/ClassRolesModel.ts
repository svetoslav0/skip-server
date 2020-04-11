import { MysqlDatabase } from "../database/MysqlDatabase";
import { ClassRoleDTO } from "../data/classRoles/ClassRoleDTO";

export class ClassRolesModel {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * This method adds a class role in the database
     *
     * @param {ClassRoleDTO} classRole
     * @returns {Promise<number>}
     */
    public async add(classRole: ClassRoleDTO): Promise<number> {
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

    /**
     * !!! USED FOR TESTING PURPOSES !!!
     *
     * This method deletes a class role by given ID
     *
     * @param {number} classRoleId
     * @returns {Promise<number>}
     */
    public async deleteById(classRoleId: number): Promise<boolean> {
        const result = await this.db.query(`
            DELETE FROM
                class_roles
            WHERE
                id = ?
        `, [classRoleId]);

        return result.affectedRows === 1;
    }
}
