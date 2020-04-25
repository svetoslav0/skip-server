import { MysqlDatabase } from "../database/MysqlDatabase";
import { ReportEntityDTO } from "../data/reportEntities/ReportEntityDTO";

export class ReportEntitiesModel {
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
                    hours_spend
                )
            VALUE (?, ?, ?, ?, ?);
        `, [
            reportEntity.reportId,
            reportEntity.date,
            reportEntity.classId,
            reportEntity.classRoleId,
            reportEntity.hoursSpend
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
}
