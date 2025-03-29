import e from "express";
import {
    LogoutRequest,
    LogoutResponse,
    LogoutResponseSchema,
    PasswordLoginRequest,
    PasswordLoginResponse,
    PasswordLoginResponseSchema,
    PasswordRegisterRequest,
    PasswordRegisterResponse,
    PasswordRegisterResponseSchema,
    RefreshRequest,
    RefreshResponse,
    RefreshResponseSchema,
    TemporaryRegisterLoginRequest,
    TemporaryRegisterLoginResponse,
    TemporaryRegisterLoginResponseSchema,
} from "../../../../../../gen/pb/api/v1/app/authentication/service_pb";
import {Injectable} from "@nestjs/common";
import {
    AuthenticationServiceService
} from "../../../../../../gen/pb/api/v1/app/authentication/service/AuthenticationService_rb.service";
import {PostgresProvider} from "../../../../../global/postgres.provider";
import {RequestTimeProvider} from "../../../../../global/request_time.provider";
import {create, fromJson} from "@bufbuild/protobuf";
import {AuthenticationPasswordProvider} from "./authentication_password.provider";
import {ConfigProvider} from "../../../../../global/config.provider";
import {AuthenticationTemporaryProvider} from "./authentication_temporary.provider";
import {extractJWT, JwtProvider} from "./jwt.provider";
import {throwPreconditionFailed, throwUnauthorized} from "../../../../../../exception/exception";
import {Session$} from "../../../../../../gen/pg/dao/dao_Session";
import {
    AccessTokenPayload_Data, AccessTokenPayload_DataSchema,
    RefreshTokenPayload_Data, RefreshTokenPayload_DataSchema
} from "../../../../../../gen/pb/api/v1/jwt_pb";
import {SessionProvider} from "./session.provider";
import {ClientType} from "../../../../../../gen/pb/api/v1/client_pb";
import {RandomProvider} from "../../../../../global/random.provider";
import {date, duration, instant} from "../../../../../../lib/temporal";

@Injectable()
export class AuthenticationService extends AuthenticationServiceService {
    constructor(
        private readonly config: ConfigProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly session: SessionProvider,
        private readonly password: AuthenticationPasswordProvider,
        private readonly temporary: AuthenticationTemporaryProvider,
        private readonly random: RandomProvider,
        private readonly jwt: JwtProvider,
    ) {
        super();
    }

    async handleTemporaryRegisterLogin(input: TemporaryRegisterLoginRequest, req: e.Request, res: e.Response): Promise<TemporaryRegisterLoginResponse> {
        const t = this.requestTime.extract(req);
        const configAuth = this.config.get().authentication!;
        const seconds = input.clientType === ClientType.MOBILE ?
            configAuth.refreshExpireSecondsMobile : configAuth.refreshExpireSecondsWeb;
        const expireTime = date(instant(t).add(duration(seconds)));

        return await this.postgres.transaction(async (tx) => {
            // Create a new temporary authentication
            const authenticationId = this.random.uuid();
            await this.temporary.create(tx, authenticationId, t);

            // Create a new session
            const sessionId = this.random.uuid();
            await this.session.create(tx, sessionId, authenticationId, expireTime, t);

            // Issue an access token and a refresh token
            const {at, rt} = this.issueTokens(sessionId, t, expireTime);

            return create(TemporaryRegisterLoginResponseSchema, {accessToken: at, refreshToken: rt});
        });
    }

    private issueTokens(sessionId: string, t: Date, expireTime: Date) {
        const at = this.jwt.issueAccessToken(create(AccessTokenPayload_DataSchema, {
            sessionId,
            scopes: ["user", "session:logout"],
        }), t);
        const rt = this.jwt.issueRefreshToken(fromJson(RefreshTokenPayload_DataSchema, {
            sessionId,
            scopes: ["session:refresh"],
        }), expireTime, t);
        return {at, rt};
    }

    async handlePasswordLogin(input: PasswordLoginRequest, req: e.Request, res: e.Response): Promise<PasswordLoginResponse> {
        const t = this.requestTime.extract(req);
        const configAuth = this.config.get().authentication!;
        const seconds = input.clientType === ClientType.MOBILE ?
            configAuth.refreshExpireSecondsMobile : configAuth.refreshExpireSecondsWeb;
        const expireTime = date(instant(t).add(duration(seconds)));
        return await this.postgres.transaction(async (tx) => {
            // Check the password
            const auth = await this.password.verify(tx, input.loginId, input.password);
            if (auth == null) {
                throwUnauthorized('password incorrect', 'password incorrect');
            }
            const authenticationId = auth!.authentication_id;

            // Create a new session
            const sessionId = this.random.uuid();
            await this.session.create(tx, sessionId, authenticationId, expireTime, t);

            // Issue an access token and a refresh token
            const {at, rt} = this.issueTokens(sessionId, t, expireTime);

            return create(PasswordLoginResponseSchema, {accessToken: at, refreshToken: rt});
        });
    }

    async handlePasswordRegister(input: PasswordRegisterRequest, req: e.Request, res: e.Response): Promise<PasswordRegisterResponse> {
        const t = this.requestTime.extract(req);
        return await this.postgres.transaction(async (tx) => {
            // Check if the login ID is already registered
            if (await this.password.exists(tx, input.loginId)) {
                throwPreconditionFailed('login_id already exists', 'login_id already exists');
            }

            // Create a new authentication
            const authenticationId = this.random.uuid();
            await this.password.register(tx, t, authenticationId, input.loginId, this.random.salt(), input.password);
            return create(PasswordRegisterResponseSchema, {});
        });
    }

    async handleLogout(input: LogoutRequest, req: e.Request, res: e.Response): Promise<LogoutResponse> {
        const t = this.requestTime.extract(req);
        const accessToken = extractJWT(req);
        if (accessToken == null) {
            throwUnauthorized('access token not found', 'access token not found');
        }
        let payload: AccessTokenPayload_Data;
        try {
            payload = this.jwt.verifyAccessToken(accessToken, t);
        } catch (e) {
            throwUnauthorized('access token invalid', 'access token invalid', {cause: e});
        }
        const sessionId = payload.sessionId;
        if (sessionId === "") {
            throwUnauthorized('session_id not found', 'session_id not found in refresh token');
        }
        await this.postgres.transaction(async (tx) => {
            await Session$.delete(tx, {session_id: sessionId});
        });
        return Promise.resolve(create(LogoutResponseSchema, {}));
    }

    async handleRefresh(input: RefreshRequest, req: e.Request, res: e.Response): Promise<RefreshResponse> {
        const t = this.requestTime.extract(req);
        const refreshToken = extractJWT(req);
        if (refreshToken == null) {
            throwUnauthorized('refresh token not found', 'refresh token not found');
        }
        let payload: RefreshTokenPayload_Data;
        try {
            payload = this.jwt.verifyRefreshToken(refreshToken, t);
        } catch (e) {
            throwUnauthorized('refresh token invalid', 'refresh token invalid', {cause: e});
        }
        if (payload.sessionId === '') {
            throwUnauthorized('session_id not found', 'session_id not found in refresh token');
        }
        const configAuth = this.config.get().authentication!;
        const seconds = input.clientType === ClientType.MOBILE ?
            configAuth.refreshExpireSecondsMobile : configAuth.refreshExpireSecondsWeb;
        const expireTime = date(instant(t).add(duration(seconds)));
        return await this.postgres.transaction(async (tx) => {
            const session = await this.session.findValid(tx, payload.sessionId, t);
            if (session == null) {
                throwUnauthorized('session not found', 'valid session not found');
            }
            session.expire_time = expireTime;
            session.update_time = t;
            await Session$.update(tx, session);
            // Issue an access token and a refresh token
            const {at, rt} = this.issueTokens(session.session_id, t, expireTime);
            return create(RefreshResponseSchema, {accessToken: at, refreshToken: rt});
        });
    }
}
