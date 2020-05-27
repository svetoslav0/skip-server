import { MysqlDatabase } from "../database/MysqlDatabase";
import { UserDTO } from "../data/users/UserDTO";
import { IRepository } from "./IRepository";
import { MESSAGES } from "../common/consts/MESSAGES";

export class UsersRepository implements IRepository {

    private db: MysqlDatabase;

    constructor(db: MysqlDatabase) {
        this.db = db;
    }

    /**
     * @param user
     */
    public async add(user: UserDTO): Promise<number> {
        const result: any = await this.db.query(`
                INSERT INTO
                    users (
                        username,
                        email,
                        password,
                        first_name,
                        middle_name,
                        last_name,
                        role_id,
                        description
                    )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user.username,
            user.email,
            user.password,
            user.firstName,
            user.middleName,
            user.lastName,
            user.roleId,
            user.description
        ]);

        return result.insertId;
    }

    /**
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
     * @param {string} email
     * @return Promise<boolean>
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

    /**
     * @param {number} id
     * @return Promise<UserDTO>
     */
    public async findById(id: number): Promise<UserDTO> {
        const result: any = await this.db.query(`
            SELECT
                id,
                username,
                email,
                first_name AS firstName,
                middle_name AS middleName,
                last_name AS lastName,
                role_id AS roleId
            FROM
                users
            WHERE
                id = ?
        `, [id]);

        if (!result.length) {
            throw new Error(MESSAGES.ERRORS.USERS.ID_FIELD_NOT_EXISTING_MESSAGE);
        }

        return new UserDTO(result[0]);
    }

    /**
     * @param {string} username
     */
    public async findByUsername(username: string): Promise<UserDTO> {
        const result: any = await this.db.query(`
                SELECT
                    id,
                    username,
                    password,
                    role_id AS roleId
                FROM
                    users
                WHERE
                    username = ?
        `, [username]);

        return result[0];
    }

    /**
     * @param {number} userId
     */
    public async findRoleIdByUserId(userId: number): Promise<number> {
        const result: any = await this.db.query(`
            SELECT
                role_id AS roleId
            FROM
                users
            WHERE
                id = ?
        `, [userId]);

        return result[0];
    }

    // Used for testing purposes
    public async removeById(userId: number): Promise<void> {
        await this.db.query(`
            DELETE FROM
                users
            WHERE
                id = ?
        `, [userId]);
    }

    public async archive(id: number): Promise<boolean> {
        throw new Error("Method is not implemented!");
    }

    public async update(resourceDTO: any): Promise<boolean> {
        throw new Error("Method is not implemented!");
    }
}
