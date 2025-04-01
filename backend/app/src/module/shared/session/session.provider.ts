import {Injectable} from "@nestjs/common";
import {PgClient, selectOne} from "../../global/postgres.provider";
import {Session$} from "../../../gen/pg/dao/dao_Session";

@Injectable()
export class SessionProvider {
    async findValid(tx: PgClient, sessionId: string, timestamp: Date): Promise<Session$ | null> {
        return  await selectOne<Session$>(tx, `SELECT *
                                 FROM "Session"
                                 WHERE "session_id" = $1
                                   AND ("expire_time" IS NULL OR "expire_time" > $2)`, [sessionId, timestamp]);
    }
}