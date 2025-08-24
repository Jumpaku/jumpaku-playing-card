import {Injectable} from "@nestjs/common";
import {PgClient, selectOne} from "../../../../../global/postgres.provider";
import {Session$} from "../../../../../../gen/pg/dao/dao_Session";

@Injectable()
export class SessionRepository {
    async create(tx: PgClient, sessionId: string, authenticationId: string, expireTime: Date, createTime: Date): Promise<Session$> {
        const session: Session$ = new Session$({
            session_id: sessionId,
            authentication_id: authenticationId,
            expire_time: expireTime,
            create_time: createTime,
            update_time: createTime,
        })
        await Session$.insert(tx, session);
        return session;
    }

    async delete(tx: PgClient, sessionId: string): Promise<void> {
        await Session$.delete(tx, {session_id: sessionId});
    }

    async findValid(tx: PgClient, sessionId: string, timestamp: Date): Promise<Session$ | null> {
        return await selectOne<Session$>(tx,
            `SELECT *
             FROM "Session"
             WHERE "session_id" = $1
               AND ("expire_time" IS NULL OR "expire_time" > $2)`,
            [sessionId, timestamp],
        );
    }
}