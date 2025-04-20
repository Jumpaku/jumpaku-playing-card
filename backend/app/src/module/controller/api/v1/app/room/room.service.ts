import {Request, Response} from "express";
import {Injectable} from "@nestjs/common";
import {RandomProvider} from "../../../../../global/random.provider";
import {PostgresProvider} from "../../../../../global/postgres.provider";
import {RequestTimeProvider} from "../../../../../global/request_time.provider";
import {throwPreconditionFailed} from "../../../../../../exception/exception";
import {create} from "@bufbuild/protobuf";
import {RoomRepository} from "./room.repository";
import {RequestSessionProvider} from "../../../../../global/request_session.provider";
import {
    BanMemberRequest,
    BanMemberResponse,
    CreateRequest,
    CreateResponse,
    CreateResponseSchema,
    EnterRequest,
    EnterResponse,
    EnterResponseSchema,
    GetRequest,
    GetResponse,
    GetResponseSchema,
    LeaveSeatRequest,
    LeaveSeatResponse,
    LeaveSeatResponseSchema,
    RoomMemberSchema,
    RoomSeatSchema,
    TakeSeatRequest,
    TakeSeatResponse,
    TakeSeatResponseSchema
} from "../../../../../../gen/pb/api/v1/app/room/service_pb";
import {RoomServiceService} from "../../../../../../gen/pb/api/v1/app/room/service/RoomService_rb.service";
import {UserProvider} from "../../../../../shared/user/user.provider";
import {range} from "../../../../../../lib/array";

@Injectable()
export class RoomService extends RoomServiceService {
    constructor(
        private readonly random: RandomProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly requestSession: RequestSessionProvider,
        private readonly room: RoomRepository,
        private readonly user: UserProvider,
    ) {
        super();
    }

    override async handleCreate(input: CreateRequest, req: Request, res: Response): Promise<CreateResponse> {
        const t = this.requestTime.extract(req);
        const room_id = this.random.uuid();
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }

        return await this.postgres.transaction(async (tx) => {
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }

            await this.room.create(tx, room_id, input.roomName, t);

            const seats = range(Number(input.seatCount)).map((i) =>
                this.room.createSeat(tx, room_id, this.random.uuid(), `${i + 1}`, null, t));
            await Promise.all(seats);

            const memberId = this.random.uuid();
            await this.room.createMember(tx, room_id, u.user_id, memberId, "1", t);

            const {room, seatList, memberList} = (await this.room.find(tx, room_id))!;
            return create(CreateResponseSchema, {
                roomId: room.room_id,
                roomName: room.room_name,
                seatList: seatList.map((s) => create(RoomSeatSchema, {
                    seatId: s.room_seat_id,
                    seatName: s.room_seat_name,
                    memberExists: s.room_member_id != null,
                    memberId: s.room_member_id ?? undefined,
                })),
                memberList: memberList.map((m) => create(RoomMemberSchema, {
                    memberId: m.room_member_id,
                    memberRole: m.role_id,
                    userId: m.user_id,
                }))
            });
        });
    }

    override async handleGet(input: GetRequest, req: Request, res: Response): Promise<GetResponse> {
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }

        return await this.postgres.transaction(async (tx) => {
            const found = await this.room.find(tx, input.roomId);
            if (found == null) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            const {room, seatList, memberList} = found;
            return create(GetResponseSchema, {
                roomId: room.room_id,
                roomName: room.room_name,
                seatList: seatList.map((s) => create(RoomSeatSchema, {
                    seatId: s.room_seat_id,
                    seatName: s.room_seat_name,
                    memberExists: s.room_member_id != null,
                    memberId: s.room_member_id ?? undefined,
                })),
                memberList: memberList.map((m) => create(RoomMemberSchema, {
                    memberId: m.room_member_id,
                    memberRole: m.role_id,
                    userId: m.user_id,
                }))
            });
        });
    }

    override async handleEnter(input: EnterRequest, req: Request, res: Response): Promise<EnterResponse> {
        const t = this.requestTime.extract(req);
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }

        return await this.postgres.transaction(async (tx) => {
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }
            if (!await this.room.exists(tx, input.roomId)) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            let member = await this.room.findMemberByUserId(tx, input.roomId, u!.user_id);
            if (member != null) {
                return create(EnterResponseSchema, {memberId: member.room_member_id});
            }
            const memberId = this.random.uuid();
            await this.room.createMember(tx, input.roomId, u.user_id, memberId, "2", t);

            return create(EnterResponseSchema, {memberId: memberId});
        });
    }

    override async handleTakeSeat(input: TakeSeatRequest, req: Request, res: Response): Promise<TakeSeatResponse> {
        const t = this.requestTime.extract(req);
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }

        return await this.postgres.transaction(async (tx) => {
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }
            if (!await this.room.exists(tx, input.roomId)) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            let m = await this.room.findMemberByUserId(tx, input.roomId, u!.user_id);
            if (m == null) {
                throwPreconditionFailed("Not in room", "Not in room");
            }
            if (!await this.room.existsSeat(tx, input.roomId, input.seatId)) {
                throwPreconditionFailed("Seat not found", "Seat not found");
            }
            await this.room.updateSeatMember(tx, input.roomId, input.seatId, m.room_member_id, t);

            return create(TakeSeatResponseSchema);
        });
    }

    override async handleLeaveSeat(input: LeaveSeatRequest, req: Request, res: Response): Promise<LeaveSeatResponse> {
        const t = this.requestTime.extract(req);
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }

        return await this.postgres.transaction(async (tx) => {
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }
            if (!await this.room.exists(tx, input.roomId)) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            let m = await this.room.findMemberByUserId(tx, input.roomId, u!.user_id);
            if (m == null) {
                throwPreconditionFailed("Not in room", "Not in room");
            }
            if (!await this.room.existsSeat(tx, input.roomId, input.seatId)) {
                throwPreconditionFailed("Seat not found", "Seat not found");
            }
            await this.room.updateSeatMember(tx, input.roomId, input.seatId, null, t);

            return create(LeaveSeatResponseSchema);
        });
    }

    override async handleBanMember(input: BanMemberRequest, req: Request, res: Response): Promise<BanMemberResponse> {
        throw new Error("Method not implemented.");
    }
}
