import {Injectable} from "@nestjs/common";
import {pbkdf2Sync} from "node:crypto";
import {PgClient, selectOne} from "../../../../../global/postgres.provider";
import {Authentication$} from "../../../../../../gen/pg/dao/dao_Authentication";
import {AuthenticationPassword$} from "../../../../../../gen/pg/dao/dao_AuthenticationPassword";

@Injectable()
export class AuthenticationPasswordProvider {
    private hash(password: string, salt: string): string {
        const h = pbkdf2Sync(password, salt, 10000, 64, 'sha512');
        return h.toString('hex');
    }

    async exists(tx: PgClient, loginId: string): Promise<boolean> {
        const found = await AuthenticationPassword$.findByUk_AuthenticationPassword_LoginId(tx, {login_id: loginId});
        return found != null;
    }

    async register(tx: PgClient, timestamp: Date, authenticationId: string, loginId: string, salt: string, password: string): Promise<void> {
        const hash = this.hash(password, salt);
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

    async verify(tx: PgClient, loginId: string, password: string): Promise<Authentication$ | null> {
        const ap = await selectOne<Authentication$ & {
            password_hash: string,
            password_salt: string
        }>(tx, `SELECT a.*,
                       ap."password_hash",
                       ap."password_salt"
                FROM "AuthenticationPassword" AS ap
                         JOIN "Authentication" AS a
                              ON ap."authentication_id" = a."authentication_id"
                WHERE ap."login_id" = $1
                  AND a."auth_method" = 'password'
                LIMIT 1`, [loginId]);
        if (ap == null) {
            return null;
        }
        if (ap.password_hash !== this.hash(password, ap.password_salt)) {
            return null;
        }

        return ap;
    }
}