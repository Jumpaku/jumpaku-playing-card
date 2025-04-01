import {Injectable} from "@nestjs/common";
import {User$} from "../../../../../../gen/pg/dao/dao_User";
import {PgClient, selectOne} from "../../../../../global/postgres.provider";
import {Authentication$} from "../../../../../../gen/pg/dao/dao_Authentication";

@Injectable()
export class UserRepository {
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

    async create(tx: PgClient, userId: string, displayName: string, t: Date): Promise<void> {
        await User$.insert(tx, {
            user_id: userId,
            display_name: displayName,
            create_time: t,
            update_time: t,
        });
    }
}