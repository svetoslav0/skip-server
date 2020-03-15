import {MysqlDatabase} from "../database/MysqlDatabase";
import {ReportDTO} from "../data/reports/ReportDTO";

export class ReportsModel {
    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    public async add(report: ReportDTO): Promise<number> {
        const result: any = await this.db.query(`
                INSERT INTO
                    reports (
                        user_id,
                        name
                    )
                VALUES (?, ?)
        `, [
            report.userId,
            report.name
        ]);

        return result.insertId;
    }

    public async findById(reportId: number): Promise<any> {
        const result: any = await this.db.query(`
                SELECT
                    id,
                    user_id as userId,
                    name
                FROM
                    reports
                WHERE
                    id = ?
        `, [reportId]);

        if (!result.length) {
            return null;
        }

        const report = new ReportDTO(result[0]);

        if (result.length !== 0) {
            report.id = reportId;
        }

        return report;
    }

    public async update(report: ReportDTO): Promise<boolean> {
        const result = await this.db.query(`
            UPDATE
                reports
            SET
                name = ?
            WHERE
                id = ?
        `, [report.name, report.id]);

        return result.affectedRows === 1;
    }

    /**
     * Deletes report from the database by given report ID
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
