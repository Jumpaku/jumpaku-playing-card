import {Injectable} from "@nestjs/common";
import {RandomProviderToken} from "../../../../../global/random.provider";
import {ConfigProvider} from "../../../../../global/config.provider";
import {PgClient} from "../../../../../global/postgres.provider";
import {issueJWT} from "../../../../../../lib/jwt";
import {Authentication$} from "../../../../../../gen/pg/dao/dao_Authentication";
import {Session$} from "../../../../../../gen/pg/dao/dao_Session";

@Injectable()
export class AuthenticationTemporaryProvider {
    constructor(
        private readonly config: ConfigProvider,
        private readonly random: RandomProviderToken,
    ) {
    }

    private readonly configAuth = this.config.get().auth!;

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

    async register(tx: PgClient, timestamp: Date): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const authenticationId = this.random.uuid();
        await Authentication$.insert(tx, {
            authentication_id: authenticationId,
            auth_method: 'temporary',
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
}