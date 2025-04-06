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
import {RoomRepository} from "./room.repository";
import {UserAuthentication$} from "../../../../../../gen/pg/dao/dao_UserAuthentication";
import {RequestSessionProvider} from "../../../../../global/request_session.provider";
import {SessionProvider} from "../../../../../shared/session/session.provider";
import type {
    CreateRoomRequest,
    CreateRoomResponse,
    GetRoomRequest, GetRoomResponse
} from "../../../../../../gen/pb/api/v1/app/room/service_pb";
import {RoomServiceService} from "../../../../../../gen/pb/api/v1/app/room/service/RoomService_rb.service";

@Injectable()
export class RoomService extends RoomServiceService {
    constructor(
        private readonly random: RandomProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly requestSession: RequestSessionProvider,
        private readonly room: RoomRepository,
    ) {
        super();
    }

    override async handleCreateRoom(input: CreateRoomRequest, req: Request, res: Response): Promise<CreateRoomResponse> {
        return undefined as any
    }

    override async handleGetRoom(input: GetRoomRequest, req: Request, res: Response): Promise<GetRoomResponse> {
        return undefined as any
    }
}
