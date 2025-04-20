import {Request, Response} from "express";
import {Injectable} from "@nestjs/common";
import {UserServiceService} from "../../../../../../gen/pb/api/v1/app/user/service/UserService_rb.service";
import {
    CreateUserRequest,
    CreateUserResponse,
    CreateUserResponseSchema,
    GetUserRequest,
    GetUserResponse,
    GetUserResponseSchema,
    RegisterUserAuthenticationRequest,
    RegisterUserAuthenticationResponse
} from "../../../../../../gen/pb/api/v1/app/user/service_pb";
import {RandomProvider} from "../../../../../global/random.provider";
import {PostgresProvider} from "../../../../../global/postgres.provider";
import {RequestTimeProvider} from "../../../../../global/request_time.provider";
import {User$} from "../../../../../../gen/pg/dao/dao_User";
import {throwPreconditionFailed} from "../../../../../../exception/exception";
import {create} from "@bufbuild/protobuf";
import {UserRepository} from "./user.repository";
import {UserAuthentication$} from "../../../../../../gen/pg/dao/dao_UserAuthentication";
import {RequestSessionProvider} from "../../../../../global/request_session.provider";
import {SessionProvider} from "../../../../../shared/session/session.provider";
import {UserProvider} from "../../../../../shared/user/user.provider";

@Injectable()
export class UserService extends UserServiceService {
    constructor(
        private readonly random: RandomProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly requestSession: RequestSessionProvider,
        private readonly session: SessionProvider,
        private readonly userRepository: UserRepository,
        private readonly user: UserProvider,
    ) {
        super();
    }

    handleCreateUser(input: CreateUserRequest, req: Request, res: Response): Promise<CreateUserResponse> {
        const sessionId = this.requestSession.mustExtract(req);
        const t = this.requestTime.extract(req);
        return this.postgres.transaction(async (tx) => {
            const user = await this.user.findUserBySessionId(tx, sessionId);
            if (user != null) {
                throwPreconditionFailed("User already exists", "User already exists");
            }
            const session = await this.session.findValid(tx, sessionId, t);
            if (session == null) {
                throwPreconditionFailed("Session not found", "Session not found");
            }

            const userId = this.random.uuid();
            await this.userRepository.create(tx, userId, input.displayName, this.random.uuid(), session?.authentication_id, t);
            return create(CreateUserResponseSchema, {
                userId: userId,
                displayName: input.displayName,
            });
        });
    }

    handleGetUser(input: GetUserRequest, req: Request, res: Response): Promise<GetUserResponse> {
        const sessionId = this.requestSession.mustExtract(req);
        return this.postgres.transaction(async (tx) => {
            const user = await this.user.findUserBySessionId(tx, sessionId);
            if (user == null) {
                throwPreconditionFailed("User not found", "User not found");
            }
            return create(GetUserResponseSchema, {
                userId: user!.user_id,
                displayName: user!.display_name,
            });
        });
    }

    handleAddUserAuthentication(input: RegisterUserAuthenticationRequest, req: Request, res: Response): Promise<RegisterUserAuthenticationResponse> {
        return throwPreconditionFailed("Not implemented", "Not implemented");
    }

    handleRemoveUserAuthentication(input: RegisterUserAuthenticationRequest, req: Request, res: Response): Promise<RegisterUserAuthenticationResponse> {
        return throwPreconditionFailed("Not implemented", "Not implemented");
    }
}
