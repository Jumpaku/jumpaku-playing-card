import {Injectable} from "@nestjs/common";
import {PgClient} from "../../../../../global/postgres.provider";
import {Authentication$} from "../../../../../../gen/pg/dao/dao_Authentication";

@Injectable()
export class AuthenticationTemporaryProvider {
    async create(tx: PgClient, authenticationId:string, createTime: Date): Promise<Authentication$> {
        const a = new Authentication$( {
            authentication_id: authenticationId,
            auth_method: 'temporary',
            create_time: createTime,
            update_time: createTime,
        })
        await Authentication$.insert(tx, a);
        return a;
    }
}