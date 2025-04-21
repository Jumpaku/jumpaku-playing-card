import {PgClient, selectOne} from "../../global/postgres.provider";
import {User$} from "../../../gen/pg/dao/dao_User";

export class UserRepository {
    async existsBySessionId(tx: PgClient, sessionId: string): Promise<boolean> {
        const found = await this.findUserBySessionId(tx, sessionId);
        return found != null;
    }

    async findUserBySessionId(tx: PgClient, sessionId: string): Promise<User$ | null> {
        return await selectOne<User$>(tx,
            `SELECT "User".*
             FROM "Session"
                      JOIN "Authentication"
                           ON "Authentication".authentication_id = "Session".authentication_id
                      JOIN "UserAuthentication"
                           ON "UserAuthentication".authentication_id = "Authentication".authentication_id
                      JOIN "User"
                           ON "User".user_id = "UserAuthentication".user_id
             WHERE "Session".session_id = $1`,
            [sessionId],
        );
    }
}