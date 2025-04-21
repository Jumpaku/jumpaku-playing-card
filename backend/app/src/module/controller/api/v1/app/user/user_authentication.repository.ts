import {Injectable} from "@nestjs/common";
import {PgClient, selectOne} from "../../../../../global/postgres.provider";
import {Authentication$} from "../../../../../../gen/pg/dao/dao_Authentication";

@Injectable()
export class UserAuthenticationRepository {
    async findAuthenticationBySessionId(tx: PgClient, sessionId: string): Promise<Authentication$ | null> {
        return await selectOne<Authentication$>(tx,
            `SELECT "Authentication".*
             FROM "Session"
                      JOIN "Authentication"
                           ON "Authentication"."authentication_id" = "Session"."authentication_id"
             WHERE "Session"."session_id" = $1`,
            [sessionId],
        );
    }

}