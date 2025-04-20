import {PgClient, selectOne} from "../../global/postgres.provider";
import {User$} from "../../../gen/pg/dao/dao_User";
import {Authentication$} from "../../../gen/pg/dao/dao_Authentication";

export class UserProvider {
    async findUserBySessionId(tx: PgClient, sessionId: string) {
        return selectOne<User$ & Authentication$>(tx,
            `SELECT "User".*,
                    "Authentication".*
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