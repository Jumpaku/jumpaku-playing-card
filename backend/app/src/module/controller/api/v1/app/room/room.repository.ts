import {Injectable} from "@nestjs/common";
import {PgClient, selectAll} from "../../../../../global/postgres.provider";
import {Room$} from "../../../../../../gen/pg/dao/dao_Room";
import {RoomSeat$} from "../../../../../../gen/pg/dao/dao_RoomSeat";
import {RoomMember$} from "../../../../../../gen/pg/dao/dao_RoomMember";
import {panic} from "../../../../../../lib/panic";
import {compareString} from "../../../../../../lib/compare";

export type RoomSeatMemberUser = RoomSeat$ & {
    room_member_id: string | null;
    user_id: string | null;
    display_name: string | null;
};

export type RoomMemberUser = RoomMember$ & {
    user_id: string | null;
    display_name: string | null;
};

@Injectable()
export class RoomRepository {
    async create(tx: PgClient, roomId: string, roomName: string, t: Date): Promise<void> {
        await Room$.insert(tx, {
            room_id: roomId,
            room_name: roomName,
            create_time: t,
            update_time: t,
        });
    }

    async exists(tx: PgClient, roomId: string): Promise<boolean> {
        const room = await Room$.find(tx, {room_id: roomId});
        return room != null;
    }

    async find(tx: PgClient, roomId: string): Promise<{
        room: Room$,
        seatList: RoomSeatMemberUser[],
        memberList: RoomMemberUser[],
    } | null> {
        const room = await Room$.find(tx, {room_id: roomId});
        if (room == null) {
            return null;
        }

        const seatList = await selectAll<RoomSeatMemberUser>(tx,
            `SELECT "RoomSeat".*,
                    "RoomMember"."room_member_id",
                    "User"."user_id",
                    "User"."display_name"
             FROM "RoomSeat"
                      LEFT OUTER JOIN "RoomMember" ON "RoomSeat"."room_member_id" = "RoomMember"."room_member_id"
                      LEFT OUTER JOIN "User" on "RoomMember".user_id = "User".user_id
             WHERE "RoomSeat"."room_id" = $1`,
            [roomId],
        );
        seatList.sort((a, b) => compareString(a.room_seat_id, b.room_seat_id))

        const memberList = await selectAll<RoomMemberUser>(tx,
            `SELECT "RoomMember".*,
                    "User"."user_id",
                    "User"."display_name"
             FROM "RoomMember"
                      LEFT OUTER JOIN "User" on "RoomMember".user_id = "User".user_id
             WHERE "RoomMember"."room_id" = $1`,
            [roomId],
        );
        memberList.sort((a, b) => compareString(a.room_member_id, b.room_member_id))
        return {room, seatList, memberList};
    }

    async createSeat(tx: PgClient, roomId: string, seatId: string, seatName: string, memberId: string | null, t: Date): Promise<void> {
        await RoomSeat$.insert(tx, {
            room_seat_id: seatId,
            room_id: roomId,
            room_seat_name: seatName,
            room_member_id: memberId,
            create_time: t,
            update_time: t,
        });
    }

    async existsSeat(tx: PgClient, roomId: string, seatId: string): Promise<boolean> {
        const s = await RoomSeat$.find(tx, {room_seat_id: seatId});
        return !(s == null || s.room_id !== roomId);
    }

    async updateSeatMember(tx: PgClient, roomId: string, seatId: string, memberId: string | null, t: Date): Promise<void> {
        const s = await RoomSeat$.find(tx, {room_seat_id: seatId});
        if (s == null) {
            panic(`Seat not found: ${seatId}`);
        }
        if (s.room_id !== roomId) {
            panic(`Seat not in room: ${roomId} ${seatId}`);
        }
        s.room_member_id = memberId;
        s.update_time = t;
        await RoomSeat$.upsert(tx, s);
    }

    async findSeatByMemberId(tx: PgClient, roomId: string, memberId: string): Promise<RoomSeat$ | null> {
        return await RoomSeat$.findByUq_RoomSeat_RoomMember(tx, {room_id: roomId, room_member_id: memberId});
    }

    async createMember(tx: PgClient, roomId: string, userId: string, memberId: string, roleId: string, t: Date): Promise<void> {
        await RoomMember$.insert(tx, {
            user_id: userId,
            room_id: roomId,
            room_member_id: memberId,
            role_id: roleId,
            create_time: t,
            update_time: t,
        });
    }

    async findMemberByUserId(tx: PgClient, roomId: string, userId: string): Promise<RoomMember$ | null> {
        return await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
            user_id: userId,
            room_id: roomId,
        });
    }
}