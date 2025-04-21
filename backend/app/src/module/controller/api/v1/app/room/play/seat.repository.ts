import {Injectable} from "@nestjs/common";
import {PgClient} from "../../../../../../global/postgres.provider";
import {RoomSeat$} from "../../../../../../../gen/pg/dao/dao_RoomSeat";

@Injectable()
export class SeatRepository {
    async existsInRoom(tx: PgClient, roomId: string, seatId: string): Promise<boolean> {
        const s = await RoomSeat$.find(tx, {room_seat_id: seatId});
        return !(s == null || s.room_id !== roomId);
    }

    async findByRoomIdAndMemberId(tx: PgClient, roomId: string, memberId: string): Promise<RoomSeat$ | null> {
        return await RoomSeat$.findByUq_RoomSeat_RoomMember(tx, {room_id: roomId, room_member_id: memberId});
    }
}