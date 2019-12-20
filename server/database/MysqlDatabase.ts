import mysql from 'mysql';

mysql.createConnection({

});

export class MysqlDatabase {

    private db: mysql.Connection;

    constructor() {
        this.db = this.config();
    }

    private config(): mysql.Connection {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });
    }

    public async query(queryString: string, params: Array<any> = []) {
        this.config().connect();

        return new Promise((resolve, reject) => {
            this.db.query(queryString, params, (err: mysql.MysqlError | null, rows: []) => {
                if (err) {
                    throw err;
                }

                resolve(rows);
                this.db.end();
            });
        });
    }
}