import {Injectable} from "@nestjs/common";
import {RandomProviderToken} from "../../../../../global/random.provider";
import {pbkdf2Sync} from "node:crypto";
import {ConfigProvider} from "../../../../../global/config.provider";
import {PgClient, selectOne} from "../../../../../global/postgres.provider";
import {issueJWT} from "../../../../../../lib/jwt";
import {Authentication$} from "../../../../../../gen/pg/dao/dao_Authentication";
import {AuthenticationPassword$} from "../../../../../../gen/pg/dao/dao_AuthenticationPassword";
import {Session$} from "../../../../../../gen/pg/dao/dao_Session";

@Injectable()
export class AuthenticationPasswordProvider {
    constructor(
        private readonly config: ConfigProvider,
        private readonly random: RandomProviderToken,
    ) {
    }

    private readonly configAuth = this.config.get().auth!;

    private hash(password: string): { salt: string; hash: string };
    private hash(password: string, salt: string): { hash: string };
    private  hash(password: string, salt?: string): { salt?: string; hash: string } {
        if (salt == null) {
            const s = this.random.salt();
            return {...this.hash(password, s), salt: s};
        }
        const h = pbkdf2Sync(password, salt, 10000, 64, 'sha512');
        return {hash: h.toString('hex')};
    }

    private verify(password: string, salt: string, hash: string): boolean {
        const {hash: h} = this.hash(password, salt);
        return hash === h;
    }

    private issueAccessToken(payload: {}, timestamp: Date): string {
        return issueJWT(payload, this.configAuth!.secretKey!, {
            algorithm: 'RS256',
            issuedAt: timestamp,
            expiresIn: new Date(timestamp.getTime() + this.configAuth!.password!.accessExpire!),
            notBefore: timestamp,
            issuer: 'auth',
            audience: 'auth',
            subject: 'auth',
        });
    }

    private issueRefreshToken(payload: {}, timestamp: Date): string {
        return issueJWT(payload, this.configAuth!.secretKey!, {
            algorithm: 'RS256',
            issuedAt: timestamp,
            expiresIn: new Date(timestamp.getTime() + this.configAuth!.password!.refreshExpire!),
            notBefore: timestamp,
            issuer: 'auth',
            audience: 'auth',
            subject: 'auth',
        });
    }

    async register(tx: PgClient, timestamp: Date, loginId: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const authenticationId = this.random.uuid();
        const {hash, salt} = this.hash(password);
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

        const sessionId = this.random.uuid();
        await Session$.insert(tx, {
            session_id: sessionId,
            expire_time: null,
            create_time: timestamp,
            update_time: timestamp,
        });

        return {
            accessToken: this.issueAccessToken({}, timestamp),
            refreshToken: this.issueRefreshToken({}, timestamp),
        };
    }

    async login(tx: PgClient, timestamp: Date, loginId: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const ap = await selectOne<{
            password_hash: string,
            password_salt: string
        }>(tx, `SELECT ap."password_hash",
                       ap."password_salt"
                FROM "Authentication" AS a
                         JOIN "AuthenticationPassword" AS ap
                              ON ap."authentication_id" = a."authentication_id"
                WHERE ap."login_id" = $1
                  AND a."auth_method" = 'password'
                LIMIT 1`, [loginId]);
        if (ap == null) {
            throw new Error('user not found');
        }

        const verified = this.verify(password, ap.password_salt, ap.password_hash);
        if (!verified) {
            throw new Error('password incorrect');
        }

        return {
            accessToken: this.issueAccessToken({}, timestamp),
            refreshToken: this.issueRefreshToken({}, timestamp),
        };
    }
}