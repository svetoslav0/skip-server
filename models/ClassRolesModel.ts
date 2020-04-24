import { MysqlDatabase } from "../database/MysqlDatabase";
import { ClassRoleDTO } from "../data/classRoles/ClassRoleDTO";
import { ClassRoleEditDTO } from "../data/classRoles/ClassRoleEditDTO";

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
     * This method accepts Class Role ID, finds a Class Role object
     *  and returns it
     *
     * @param {number} id
     * @returns {Promise<ClassRoleEditDTO>}
     */
    public async findById(id: number): Promise<ClassRoleEditDTO | null> {
        const result = await this.db.query(`
            SELECT
                id,
                name,
                payment_per_hour AS paymentPerHour
            FROM
                class_roles
            WHERE
                id = ?
        `, [id]);

        if (!result.length) {
            return null;
        }

        return new ClassRoleEditDTO(result[0].id, result[0]);
    }

    /**
     * This method updates class role and returns if it was successful or not
     *
     * @param {ClassRoleEditDTO} classRole
     * @returns {Promise<boolean>}
     */
    public async update(classRole: ClassRoleEditDTO): Promise<boolean> {
        const result = await this.db.query(`
            UPDATE
                class_roles
            SET
                name = ?,
                payment_per_hour = ?
            WHERE
                id = ?
        `, [classRole.name, classRole.paymentPerHour, classRole.id]);

        return result.affectedRows;
    }

    /**
     * This method updates 'is_archived' field of a class role
     *
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    public async archive(id: number): Promise<boolean> {
        const archived: number = 1;

        const result = await this.db.query(`
            UPDATE
                class_roles
            SET
                is_archived = ?
            WHERE
                id = ?
        `, [archived, id]);

        return result.affectedRows === 1;
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
