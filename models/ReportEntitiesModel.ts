import { MysqlDatabase } from "../database/MysqlDatabase";
import { ReportEntityDTO } from "../data/reportEntities/ReportEntityDTO";
import { IModel } from "./IModel";
import { ReportEntityEditDTO } from "../data/reportEntities/ReportEntityEditDTO";

export class ReportEntitiesModel implements IModel {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * Inserts a report entity
     *
     * @param {ReportEntityDTO} reportEntity
     * @returns {Promise<number>}
     */
    public async add(reportEntity: ReportEntityDTO): Promise<number> {
        const result: any = await this.db.query(`
            INSERT INTO
                report_entities (
                    report_id,
                    date,
                    class_id,
                    class_role_id,
                    hours_spend,
                    user_id
                )
            VALUE (?, ?, ?, ?, ?, ?);
        `, [
            reportEntity.reportId,
            reportEntity.date,
            reportEntity.classId,
            reportEntity.classRoleId,
            reportEntity.hoursSpend,
            reportEntity.userId
        ]);

        return result.insertId;
    }

    /**
     * !!! USED FOR TESTING PURPOSES !!!
     *
     * This method deletes a report entity by given ID
     *
     * @param {number} id
     * @returns {Promise<number>}
     */
    public async deleteById(id: number): Promise<boolean> {
        const result = await this.db.query(`
            DELETE FROM
                report_entities
            WHERE
                id = ?
        `, [id]);

        return result.affectedRows === 1;
    }

    public archive(id: number): Promise<boolean> {
        // TODO: implement this method!
        throw new Error("Method not implemented!");
    }

    /**
     * @param {number} id
     * @return {Promise<ReportEntityEditDTO | null>}
     */
    public async findById(id: number): Promise<ReportEntityEditDTO | null> {
        const result = await this.db.query(`
            SELECT
                id,
                report_id AS reportId,
                date,
                class_id AS classId,
                class_role_id AS classRoleId,
                user_id AS userId,
                hours_spend AS hoursSpend
            FROM
                report_entities
            WHERE
                id = ?
        `, [id]);

        if (!result.length) {
            return null;
        }

        const entity = new ReportEntityEditDTO(result[0].id, result[0]);

        if (result.length !== 0) {
            entity.id = id;
        }

        return entity;
    }

    /**
     * @param {ReportEntityEditDTO} entity
     * @returns {Promise<boolean>}
     */
    public async update(entity: ReportEntityEditDTO): Promise<boolean> {
        const result = await this.db.query(`
            UPDATE
                report_entities
            SET
                class_id = ?,
                class_role_id = ?,
                report_id = ?,
                hours_spend = ?,
                date = ?,
                user_id = ?
            WHERE
                id = ?
        `, [
            entity.classId,
            entity.classRoleId,
            entity.reportId,
            entity.hoursSpend,
            entity.date,
            entity.userId,
            entity.id
        ]);

        return result.affectedRows === 1;
    }
}
