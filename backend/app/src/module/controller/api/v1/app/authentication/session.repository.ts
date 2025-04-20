import {Injectable} from "@nestjs/common";
import {PgClient} from "../../../../../global/postgres.provider";
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
}