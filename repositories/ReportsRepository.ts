import { MysqlDatabase } from "../database/MysqlDatabase";
import { ReportDTO } from "../data/reports/ReportDTO";
import { ReportEditDTO } from "../data/reports/ReportEditDTO";
import { IRepository } from "./IRepository";

export class ReportsRepository implements IRepository {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * @param {ReportDTO} report
     * @returns {Promise<number>}
     */
    public async add(report: ReportDTO): Promise<number> {
        const result: any = await this.db.query(`
                INSERT INTO
                    reports (
                        user_id,
                        name,
                        description
                    )
                VALUES (?, ?, ?)
        `, [
            report.userId,
            report.name,
            report.description
        ]);

        return result.insertId;
    }

    /**
     * @param {number} reportId
     * @returns {Promise<ReportEditDTO|null>}
     */
    public async findById(reportId: number): Promise<ReportEditDTO|null> {
        const result: any = await this.db.query(`
                SELECT
                    id,
                    user_id AS userId,
                    name,
                    description
                FROM
                    reports
                WHERE
                    id = ?
        `, [reportId]);

        if (!result.length) {
            return null;
        }

        const report = new ReportEditDTO(result[0].id, result[0]);

        if (result.length !== 0) {
            report.id = reportId;
        }

        return report;
    }

    /**
     * @param {number} id
     * @returns {Promise<number>}
     */
    public async findUserIdById(id: number): Promise<number> {
        const result = await this.db.query(`
            SELECT
                user_id AS userId
            FROM
                reports
            WHERE
                id = ?
        `, [id]);

        if (!result.length) {
            return 0;
        }

        return result[0].userId;
    }

    /**
     * @param {ReportEditDTO} report
     * @returns {Promise<boolean>}
     */
    public async update(report: ReportEditDTO): Promise<boolean> {
        const result = await this.db.query(`
            UPDATE
                reports
            SET
                name = ?,
                user_id = ?,
                description = ?
            WHERE
                id = ?
        `, [
            report.name,
            report.userId,
            report.description,
            report.id
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
                reports
            SET
                is_archived = ?
            WHERE
                id = ?
        `, [isArchived, id]);

        return result.affectedRows === 1;
    }

    /**
     * *** USED FOR TEST PURPOSES ***
     * Deletes report from the database by given report ID
     *
     * @param {number} id
     * @return Promise<boolean>
     */
    public async deleteById(id: number): Promise<boolean> {
        const result = await this.db.query(`
            DELETE FROM
                reports
            WHERE
                id = ?
        `, [id]);

        return result.affectedRows === 1;
    }
}
