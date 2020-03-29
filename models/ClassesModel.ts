import { MysqlDatabase } from "../database/MysqlDatabase";
import { ClassesEditDTO } from "../data/classes/ClassesEditDTO";
import {ClassesDTO} from "../data/classes/ClassesDTO";

export class ClassesModel {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    public async add(currentClass: ClassesDTO) {
        const result = await this.db.query(`
            INSERT INTO
                classes (
                    name,
                    age_group
                )
            VALUE (?, ?)
        `, [
            currentClass.name,
            currentClass.ageGroup
        ]);

        return result.insertId;
    }

    public async findById(id: number): Promise<ClassesEditDTO|null> {
        const result = await this.db.query(`
            SELECT
                id,
                name,
                age_group AS ageGroup
            FROM
                classes
            WHERE
                id = ?
        `, [id]);

        if (!result.length) {
            return null;
        }

        return new ClassesEditDTO(result[0].id, result[0]);
    }

    public async update(currentClass: ClassesEditDTO): Promise<boolean> {
        const result = await this.db.query(`
            UPDATE
                classes
            SET
                name = ?,
                age_group = ?
            WHERE
                id = ?
        `, [currentClass.name, currentClass.ageGroup, currentClass.id]);

        return result.affectedRows === 1;
    }

    /**
     * *** USED FOR TEST PURPOSES ***
     * Deletes class from the database by given report ID
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
