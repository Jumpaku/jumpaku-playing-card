import {Request, Response} from "express";
import {Injectable} from "@nestjs/common";
import {RandomProvider} from "../../../../../global/random.provider";
import {PostgresProvider} from "../../../../../global/postgres.provider";
import {RequestTimeProvider} from "../../../../../global/request_time.provider";
import {throwPreconditionFailed} from "../../../../../../exception/exception";
import {create} from "@bufbuild/protobuf";
import {RoomRepository} from "./room.repository";
import {RequestSessionProvider} from "../../../../../global/request_session.provider";
import {SessionProvider} from "../../../../../shared/session/session.provider";
import {
    BanMemberRequest,
    BanMemberResponse,
    BanMemberResponseSchema,
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
import {Room$} from "../../../../../../gen/pg/dao/dao_Room";
import {RoomMember$} from "../../../../../../gen/pg/dao/dao_RoomMember";
import {UserProvider} from "../../../../../shared/user/user.provider";
import {RoomSeat$} from "../../../../../../gen/pg/dao/dao_RoomSeat";
import {RoomBan$} from "../../../../../../gen/pg/dao/dao_RoomBan";

@Injectable()
export class RoomService extends RoomServiceService {
    constructor(
        private readonly random: RandomProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly requestSession: RequestSessionProvider,
        private readonly session: SessionProvider,
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

            const memberId = this.random.uuid();

            await Room$.insert(tx, {
                room_id: room_id,
                room_name: input.roomName,
                create_time: t,
                update_time: t,
            });
            await RoomMember$.insert(tx, {
                room_member_id: memberId,
                room_id: room_id,
                user_id: u!.user_id,
                role_id: "1",
                create_time: t,
                update_time: t,
            });
            const seats = Array.from({length: Number(input.seatCount)}, (_, i) => (new RoomSeat$({
                room_seat_id: this.random.uuid(),
                room_id: room_id,
                room_seat_name: `${i + 1}`,
                create_time: t,
                update_time: t,
            })));
            await RoomSeat$.insert(tx, ...seats);

            return create(CreateResponseSchema, {
                roomId: room_id,
                roomName: input.roomName,
                seatList: seats.map((s) => (create(RoomSeatSchema, {
                    seatId: s.room_seat_id,
                    seatName: s.room_seat_name,
                    memberExists: false,
                }))),
                memberList: [
                    create(RoomMemberSchema, {
                        memberId: memberId,
                        memberRole: "1",
                        userId: u.user_id,
                        userName: u.display_name,
                    })
                ],
            });
        });
    }

    override async handleGet(input: GetRequest, req: Request, res: Response): Promise<GetResponse> {
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }

        return await this.postgres.transaction(async (tx) => {
            const r = await Room$.find(tx, {room_id: input.roomId});
            if (r == null) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            const seats = await RoomSeat$.listByUq_RoomSeat_RoomMember(tx, {
                room_id: input.roomId,
            });
            const members = await RoomMember$.listByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
            });

            return create(GetResponseSchema, {
                roomId: r.room_id,
                roomName: r.room_name,
                seatList: seats.map((s) => create(RoomSeatSchema, {
                    seatId: s.room_seat_id,
                    seatName: s.room_seat_name,
                    memberExists: s.room_member_id != null,
                    memberId: s.room_member_id ?? undefined,
                })),
                memberList: members.map((m) => (create(RoomMemberSchema, {
                    memberId: m.room_member_id,
                    memberRole: m.role_id,
                    userId: m.user_id,
                }))),
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
            const r = await Room$.find(tx, {room_id: input.roomId});
            if (r == null) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }
            let member = await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
                user_id: u!.user_id,
            });
            if (member != null) {
                return create(EnterResponseSchema, {memberId: member.room_member_id});
            }
            const memberId = this.random.uuid();
            await RoomMember$.upsert(tx, {
                room_member_id: memberId,
                room_id: input.roomId,
                user_id: u!.user_id,
                role_id: "2",
                create_time: t,
                update_time: t,
            });

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
            const r = await Room$.find(tx, {room_id: input.roomId});
            if (r == null) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }
            const m = await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
                user_id: u!.user_id,
            });
            if (m == null) {
                throwPreconditionFailed("Not in room", "Not in room");
            }

            const s = await RoomSeat$.find(tx, {room_seat_id: input.seatId});
            if (s == null) {
                throwPreconditionFailed("Seat not found", "Seat not found");
            }
            s.room_member_id = m.room_member_id;
            s.update_time = t;
            await RoomSeat$.upsert(tx, s);

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
            const r = await Room$.find(tx, {room_id: input.roomId});
            if (r == null) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }
            const m = await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
                user_id: u!.user_id,
            });
            if (m == null) {
                throwPreconditionFailed("Not in room", "Not in room");
            }
            const s = await RoomSeat$.find(tx, {room_seat_id: input.seatId});
            if (s == null) {
                throwPreconditionFailed("Seat not found", "Seat not found");
            }
            s.room_member_id = null;
            s.update_time = t;
            await RoomSeat$.upsert(tx, s);

            return create(LeaveSeatResponseSchema);
        });
    }

    override async handleBanMember(input: BanMemberRequest, req: Request, res: Response): Promise<BanMemberResponse> {
        const t = this.requestTime.extract(req);
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }

        return await this.postgres.transaction(async (tx) => {
            const r = await Room$.find(tx, {room_id: input.roomId});
            if (r == null) {
                throwPreconditionFailed("Room not found", "Room not found");
            }
            const m = await RoomMember$.find(tx, {room_member_id: input.memberId});
            if (m == null) {
                throwPreconditionFailed("Not in room", "Not in room");
            }
            const s = await RoomSeat$.findByUq_RoomSeat_RoomMember(tx, {
                room_id: input.roomId,
                room_member_id: m.room_member_id,
            });
            if (s != null) {
                s.room_member_id = null;
                s.update_time = t;
                await RoomSeat$.upsert(tx, s);
            }
            await RoomMember$.delete(tx, {room_member_id: m.room_member_id});
            await RoomBan$.upsert(tx, {
                room_ban_id: this.random.uuid(),
                room_id: input.roomId,
                ban_user_id: m.user_id,
                create_time: t,
                update_time: t,
            });

            return create(BanMemberResponseSchema);
        });
    }
}
