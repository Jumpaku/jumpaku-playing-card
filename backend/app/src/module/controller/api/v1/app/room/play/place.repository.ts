import {Injectable} from "@nestjs/common";
import {PgClient} from "../../../../../../global/postgres.provider";
import {RoomPlace$} from "../../../../../../../gen/pg/dao/dao_RoomPlace";

@Injectable()
export class PlaceRepository {
    async create(tx: PgClient, roomId: string, placeId: string, placeName: string, type: string, owner_seat_id: string | null, t: Date): Promise<void> {
        await RoomPlace$.insert(tx, {
            room_id: roomId,
            create_time: t,
            update_time: t,
            room_place_id: placeId,
            display_name: placeName,
            type: type,
            owner_seat_id: owner_seat_id,
        });
    }

    async delete(tx: PgClient, roomId: string, placeId: string): Promise<void> {
        await tx.query(`DELETE
                        FROM "RoomPlace"
                        WHERE "room_id" = $1
                          AND "room_place_id" = $2`, [roomId, placeId]);
    }

    async exists(tx: PgClient, roomId: string, placeId: string): Promise<boolean> {
        const found = await RoomPlace$.listByIdx_RoomPlace_RoomIdAndPlaceId(tx, {
            room_id: roomId,
            room_place_id: placeId,
        });
        return found.length > 0;
    }

    async list(tx: PgClient, roomId: string): Promise<RoomPlace$[]> {
        return await RoomPlace$.listByIdx_RoomPlace_RoomIdAndPlaceId(tx, {room_id: roomId});
    }
}