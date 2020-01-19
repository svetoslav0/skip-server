import {MysqlDatabase} from "../database/MysqlDatabase";
import {UserDTO} from "../data/UserDTO";

export class UsersModel {

    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * Inserts an user in the database and returns the ID of the created user
     * @param user
     */
    public async add(user: UserDTO): Promise<number> {
        const result: any = await this.db.query(`
                INSERT INTO
                    users (
                        username,
                        email,
                        password,
                        first_name_en,
                        middle_name_en,
                        last_name_en,
                        first_name_bg,
                        middle_name_bg,
                        last_name_bg
                    )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user.username,
            user.email,
            user.password,
            user.firstNameEn,
            user.middleNameEn,
            user.lastNameEn,
            user.firstNameBg,
            user.middleNameBg,
            user.lastNameBg,
        ]);

        return result.insertId;
    }

    /**
     * Returns "true" or "false" depending on whether username is unique or not
     * @param username
     */
    public async isUsernameUnique(username: string): Promise<boolean> {
        const result: any = await this.db.query(`
                SELECT
                    id
                FROM
                    users
                WHERE
                    username = ?
        `, [username]);

        return result.length === 0;
    }

    /**
     * Returns "true" or "false" depending on whether username is unique or not
     * @param email
     */
    public async isEmailUnique(email: string): Promise<boolean> {
        const result: any = await this.db.query(`
                SELECT
                    id
                FROM
                    users
                WHERE
                    email = ?
        `, [email]);

        return result.length === 0;
    }

    public async findByUsername(username: string): Promise<UserDTO> {
        const result: any = await this.db.query(`
                SELECT
                    id,
                    username,
                    password
                FROM
                    users
                WHERE
                    username = ?
        `, [username]);

        return result[0];
    }
}
