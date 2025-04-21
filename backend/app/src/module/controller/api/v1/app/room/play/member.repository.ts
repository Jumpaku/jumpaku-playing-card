import {Injectable} from "@nestjs/common";
import {PgClient} from "../../../../../../global/postgres.provider";
import {RoomMember$} from "../../../../../../../gen/pg/dao/dao_RoomMember";

@Injectable()
export class MemberRepository {
    async findByRoomIdAndUserId(tx: PgClient, roomId: string, userId: string): Promise<RoomMember$ | null> {
        return await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
            user_id: userId,
            room_id: roomId,
        });
    }
}