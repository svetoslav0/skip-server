import { MysqlDatabase } from "../database/MysqlDatabase";
import { ClassEditDTO } from "../data/classes/ClassEditDTO";
import { ClassDTO } from "../data/classes/ClassDTO";
import { IRepository } from "./IRepository";

export class ClassesRepository implements IRepository {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * @param {ClassDTO} currentClass
     * @returns {Promise<number>}
     */
    public async add(currentClass: ClassDTO): Promise<number> {
        const result = await this.db.query(`
            INSERT INTO
                classes (
                    name,
                    age_group,
                    description
                )
            VALUES (?, ?, ?)
        `, [
            currentClass.name,
            currentClass.ageGroup,
            currentClass.description
        ]);

        return result.insertId;
    }

    /**
     * @param {number} id
     * @returns {Promise<ReportEditDTO|null>}
     */
    public async findById(id: number): Promise<ClassEditDTO|null> {
        const result = await this.db.query(`
            SELECT
                id,
                name,
                age_group AS ageGroup,
                description
            FROM
                classes
            WHERE
                id = ?
        `, [id]);

        if (!result.length) {
            return null;
        }

        return new ClassEditDTO(result[0].id, result[0]);
    }

    /**
     * @param {ReportEditDTO} currentClass
     * @returns {Promise<boolean>}
     */
    public async update(currentClass: ClassEditDTO): Promise<boolean> {
        const result = await this.db.query(`
            UPDATE
                classes
            SET
                name = ?,
                age_group = ?,
                description = ?
            WHERE
                id = ?
        `, [
            currentClass.name,
            currentClass.ageGroup,
            currentClass.description,
            currentClass.id
        ]);

        return result.affectedRows === 1;
    }

    /**
     * @param {number} id
     * @returns {Promise<boolean>}
     */
    public async archive(id: number): Promise<boolean> {
        const isArchived: number = 1;

        const result = await this.db.query(`
            UPDATE
                classes
            SET
                is_archived = ?
            WHERE
                id = ?
        `, [isArchived, id]);

        return result.affectedRows === 1;
    }

    /**
     * *** USED FOR TEST PURPOSES ***
     * Deletes class from the database by given report ID
     *
     * @param {number} id
     * @return Promise<boolean>
     */
    public async deleteById(id: number): Promise<boolean> {
        const result = await this.db.query(`
            DELETE FROM
                classes
            WHERE
                id = ?
        `, [id]);

        return result.affectedRows === 1;
    }
}
