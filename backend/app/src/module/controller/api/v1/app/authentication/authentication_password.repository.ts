import {Injectable} from "@nestjs/common";
import {PgClient} from "../../../../../global/postgres.provider";
import {Authentication$} from "../../../../../../gen/pg/dao/dao_Authentication";
import {AuthenticationPassword$} from "../../../../../../gen/pg/dao/dao_AuthenticationPassword";

@Injectable()
export class AuthenticationPasswordRepository {
    async findByLoginId(tx: PgClient, loginId: string): Promise<AuthenticationPassword$ | null> {
        return AuthenticationPassword$.findByUk_AuthenticationPassword_LoginId(tx, {login_id: loginId});
    }

    async create(
        tx: PgClient,
        timestamp: Date,
        authenticationId: string,
        loginId: string,
        salt: string,
        hash: string,
    ): Promise<void> {
        await Authentication$.insert(tx, {
            authentication_id: authenticationId,
            auth_method: 'password',
            create_time: timestamp,
            update_time: timestamp,
        });
        await AuthenticationPassword$.insert(tx, {
            authentication_id: authenticationId,
            login_id: loginId,
            password_hash: hash,
            password_salt: salt,
            create_time: timestamp,
            update_time: timestamp,
        });
    }
}