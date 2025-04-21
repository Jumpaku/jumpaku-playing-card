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
import {throwPreconditionFailed} from "../../../../../../exception/exception";
import {create} from "@bufbuild/protobuf";
import {RequestSessionProvider} from "../../../../../global/request_session.provider";
import {UserRepository as SharedUserRepository} from "../../../../../shared/user/user.repository";
import {UserAuthenticationRepository} from "./user_authentication.repository";
import {UserRepository} from "./user.repository";

@Injectable()
export class UserService extends UserServiceService {
    constructor(
        private readonly random: RandomProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly requestSession: RequestSessionProvider,
        private readonly user: UserRepository,
        private readonly sharedUser: SharedUserRepository,
        private readonly userAuthentication: UserAuthenticationRepository,
    ) {
        super();
    }

    handleCreateUser(input: CreateUserRequest, req: Request, res: Response): Promise<CreateUserResponse> {
        const sessionId = this.requestSession.mustExtract(req);
        const t = this.requestTime.extract(req);
        return this.postgres.transaction(async (tx) => {
            if (await this.sharedUser.existsBySessionId(tx, sessionId)) {
                throwPreconditionFailed("User already exists", "User already exists");
            }
            const auth = await this.userAuthentication.findAuthenticationBySessionId(tx, sessionId);
            if (auth == null) {
                throwPreconditionFailed("Authentication not found", "Authentication not found");
            }
            const userId = this.random.uuid();
            await this.user.create(tx, userId, input.displayName, this.random.uuid(), auth.authentication_id, t);
            return create(CreateUserResponseSchema, {
                userId: userId,
                displayName: input.displayName,
            });
        });
    }

    handleGetUser(input: GetUserRequest, req: Request, res: Response): Promise<GetUserResponse> {
        const sessionId = this.requestSession.mustExtract(req);
        return this.postgres.transaction(async (tx) => {
            const user = await this.sharedUser.findUserBySessionId(tx, sessionId);
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
