import mysql from "mysql";

export class MysqlDatabase {

    private db: mysql.Connection;

    constructor() {
        this.db = this.config();
    }

    public async query(queryString: string, params: any[] = []) {
        this.config().connect();

        return new Promise((resolve, reject) => {
            this.db.query(queryString, params, (err: mysql.MysqlError | null, rows: any) => {
                if (err) {
                    throw err;
                }

                resolve(rows);
            });
        });
    }

    public endConnection() {
        this.db.end();
    }

    private config(): mysql.Connection {
        return mysql.createConnection({
            database: process.env.DB_DATABASE,
            host: process.env.DB_HOST,
            password: process.env.DB_PASS,
            user: process.env.DB_USER,
        });
    }
}
