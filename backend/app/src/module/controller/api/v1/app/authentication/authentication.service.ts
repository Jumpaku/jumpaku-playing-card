import e from "express";
import {
    LogoutRequest,
    LogoutResponse, LogoutResponseSchema,
    PasswordLoginRequest,
    PasswordLoginResponse, PasswordLoginResponseSchema,
    PasswordRegisterRequest,
    PasswordRegisterResponse, PasswordRegisterResponseSchema,
    RefreshRequest,
    RefreshResponse, RefreshResponseSchema,
    TemporaryRegisterRequest,
    TemporaryRegisterResponse, TemporaryRegisterResponseSchema,
} from "../../../../../../gen/pb/api/v1/app/authentication/service_pb";
import {Injectable} from "@nestjs/common";
import {
    AuthenticationServiceService
} from "../../../../../../gen/pb/api/v1/app/authentication/service/AuthenticationService_rb.service";
import {PostgresProvider} from "../../../../../global/postgres.provider";
import {RequestTimeProviderToken} from "../../../../../global/request_time.provider";
import {create} from "@bufbuild/protobuf";
import {AuthenticationPasswordProvider} from "./password.provider";
import {issueJWT, JwtPayload, verifyJWT} from "../../../../../../lib/jwt";
import {ConfigProvider} from "../../../../../global/config.provider";
import {AuthenticationTemporaryProvider} from "./temporary.provider";
import {extractJWT} from "./jwt";
import {throwUnauthorized} from "../../../../../../exception/exception";
import {Session$} from "../../../../../../gen/pg/dao/dao_Session";

@Injectable()
export class AuthenticationService extends AuthenticationServiceService {
    constructor(
        private readonly config: ConfigProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProviderToken,
        private readonly password: AuthenticationPasswordProvider,
        private readonly temporary: AuthenticationTemporaryProvider,
    ) {
        super();
    }

    private readonly configAuth = this.config.get().auth!;

    async handleTemporaryRegister(input: TemporaryRegisterRequest, req: e.Request, res: e.Response): Promise<TemporaryRegisterResponse> {
        const t = this.requestTime.requestTime("");
        return await this.postgres.transaction(async (tx) => {
            const {
                accessToken,
                refreshToken
            } = await this.temporary.register(tx, t);
            return create(TemporaryRegisterResponseSchema, {
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        });
    }

    async handlePasswordLogin(input: PasswordLoginRequest, req: e.Request, res: e.Response): Promise<PasswordLoginResponse> {
        const t = this.requestTime.requestTime("");
        return await this.postgres.transaction(async (tx) => {
            const {
                accessToken,
                refreshToken,
            } = await this.password.login(tx, t, input.loginId, input.password);
            return create(PasswordLoginResponseSchema, {
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        });
    }

    async handlePasswordRegister(input: PasswordRegisterRequest, req: e.Request, res: e.Response): Promise<PasswordRegisterResponse> {
        const t = this.requestTime.requestTime("");
        return await this.postgres.transaction(async (tx) => {
            const {
                accessToken,
                refreshToken
            } = await this.password.register(tx, t, input.loginId, input.password);
            return create(PasswordRegisterResponseSchema, {
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        });
    }

    async handleLogout(input: LogoutRequest, req: e.Request, res: e.Response): Promise<LogoutResponse> {
        const t = this.requestTime.requestTime("");
        const accessToken = extractJWT(req);
        if (accessToken == null) {
            throwUnauthorized('access token not found', 'access token not found');
        }
        let payload: JwtPayload;
        try {
            payload = verifyJWT(accessToken, this.configAuth.publicKey, {timestamp: t});
        } catch (e) {
            throwUnauthorized('access token invalid', 'access token invalid', {cause: e});
        }
        const sessionId = payload['session_id'];
        if (sessionId == null || typeof sessionId !== 'string') {
            throwUnauthorized('session_id not found', 'session_id not found in refresh token');
        }
        await this.postgres.transaction(async (tx) => {
            await Session$.delete(tx, {session_id: sessionId});
        })
        return Promise.resolve(create(LogoutResponseSchema, {}));
    }

    async handleRefresh(input: RefreshRequest, req: e.Request, res: e.Response): Promise<RefreshResponse> {
        const t = this.requestTime.requestTime("");
        const refreshToken = extractJWT(req);
        if (refreshToken == null) {
            throwUnauthorized('refresh token not found', 'refresh token not found');
        }
        let payload: JwtPayload;
        try {
            payload = verifyJWT(refreshToken, this.configAuth.publicKey, {timestamp: t});
        } catch (e) {
            throwUnauthorized('refresh token invalid', 'refresh token invalid', {cause: e});
        }
        const sessionId = payload['session_id'];
        if (sessionId == null || typeof sessionId !== 'string') {
            throwUnauthorized('session_id not found', 'session_id not found in refresh token');
        }
        await this.postgres.transaction(async (tx) => {
            const session = await Session$.find(tx, {session_id: sessionId});
            if (session == null) {
                throwUnauthorized('session not found', 'session not found');
            }
            if (session.expire_time != null) {
                if (session.expire_time.getTime() < t.getTime()) {
                    throwUnauthorized('session expired', 'session expired');
                }

                session.expire_time = new Date(t.getTime() + 1000 * 60 * 60);
                session.update_time = t;
            }
            await Session$.update(tx, session);
        });

        const at = issueJWT(payload, this.configAuth.secretKey, {
            algorithm: 'RS256',
            issuedAt: t,
            expiresIn: new Date(t.getTime() + 1000 * 60 * 60),
            notBefore: t,
            issuer: 'auth',
            audience: 'auth',
            subject: 'auth',
        });
        const rt = issueJWT(payload, this.configAuth.secretKey, {
            algorithm: 'RS256',
            issuedAt: t,
            expiresIn: new Date(t.getTime() + 1000 * 60 * 60 * 24 * 30),
            notBefore: t,
            issuer: 'auth',
            audience: 'auth',
            subject: 'auth',
        });
        return Promise.resolve(create(RefreshResponseSchema, {
            accessToken: at,
            refreshToken: rt,
        }));
    }
}
