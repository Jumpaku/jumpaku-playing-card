import {Request, Response} from "express";
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
import {JwtProvider} from "./jwt.provider";
import {throwPreconditionFailed, throwUnauthorized} from "../../../../../../exception/exception";
import {Session$} from "../../../../../../gen/pg/dao/dao_Session";
import {
    JwtPayload_AccessDataSchema,
    JwtPayload_RefreshDataSchema
} from "../../../../../../gen/pb/api/v1/jwt_pb";
import {SessionRepository} from "./session.repository";
import {ClientType} from "../../../../../../gen/pb/api/v1/client_pb";
import {RandomProvider} from "../../../../../global/random.provider";
import {date, duration, instant} from "../../../../../../lib/temporal";
import {RequestSessionProvider} from "../../../../../global/request_session.provider";
import {UserRepository} from "../../../../../shared/user/user.repository";

@Injectable()
export class AuthenticationService extends AuthenticationServiceService {
    constructor(
        private readonly config: ConfigProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly requestSession: RequestSessionProvider,
        private readonly session: SessionRepository,
        private readonly password: AuthenticationPasswordProvider,
        private readonly temporary: AuthenticationTemporaryProvider,
        private readonly random: RandomProvider,
        private readonly user: UserRepository,
        private readonly jwt: JwtProvider,
    ) {
        super();
    }

    async handleTemporaryRegisterLogin(input: TemporaryRegisterLoginRequest, req: Request, res: Response): Promise<TemporaryRegisterLoginResponse> {
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
            const {at, rt} = this.issueTokens(sessionId, false, t, expireTime);

            return create(TemporaryRegisterLoginResponseSchema, {accessToken: at, refreshToken: rt});
        });
    }

    async handlePasswordLogin(input: PasswordLoginRequest, req: Request, res: Response): Promise<PasswordLoginResponse> {
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
            const {at, rt} = this.issueTokens(sessionId, false, t, expireTime);

            return create(PasswordLoginResponseSchema, {accessToken: at, refreshToken: rt});
        });
    }

    async handlePasswordRegister(input: PasswordRegisterRequest, req: Request, res: Response): Promise<PasswordRegisterResponse> {
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

    async handleLogout(input: LogoutRequest, req: Request, res: Response): Promise<LogoutResponse> {
        const sessionId = this.requestSession.mustExtract(req);

        await this.postgres.transaction(async (tx) => {
            await this.session.delete(tx, sessionId);
        });

        return Promise.resolve(create(LogoutResponseSchema, {}));
    }

    async handleRefresh(input: RefreshRequest, req: Request, res: Response): Promise<RefreshResponse> {
        const t = this.requestTime.extract(req);
        const sessionId = this.requestSession.mustExtractRefresh(req);
        const configAuth = this.config.get().authentication!;
        const seconds = input.clientType === ClientType.MOBILE ?
            configAuth.refreshExpireSecondsMobile : configAuth.refreshExpireSecondsWeb;
        const expireTime = date(instant(t).add(duration(seconds)));
        return await this.postgres.transaction(async (tx) => {
            const userExists = await this.user.existsBySessionId(tx, sessionId);
            const session = await this.session.findValid(tx, sessionId, t);
            if (session == null) {
                throwUnauthorized('session not found', 'valid session not found');
            }
            await Session$.update(tx, {...session, expire_time: expireTime, update_time: t});

            // Issue an access token and a refresh token
            const {at, rt} = this.issueTokens(session.session_id, userExists, t, expireTime);
            return create(RefreshResponseSchema, {accessToken: at, refreshToken: rt});
        });
    }

    private issueTokens(sessionId: string, userExists: boolean, t: Date, expireTime: Date) {
        const at = this.jwt.issueAccessToken(create(JwtPayload_AccessDataSchema, {
            sessionId,
            scopes: ["user", "session:logout", "room", "play"],
        }), t);
        const rt = this.jwt.issueRefreshToken(fromJson(JwtPayload_RefreshDataSchema, {
            sessionId,
            scopes: ["session:refresh"],
        }), expireTime, t);
        return {at, rt};
    }
}
