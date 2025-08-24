import {Injectable} from "@nestjs/common";
import {PgClient, selectAll} from "../../../../../../global/postgres.provider";
import {RoomPlaceCard$} from "../../../../../../../gen/pg/dao/dao_RoomPlaceCard";
import {compareString} from "../../../../../../../lib/compare";

@Injectable()
export class CardRepository {
    async existsInRoomPlace(tx: PgClient, roomId: string, placeId: string): Promise<boolean> {
        const cards = await this.listByRoomIdAndPlaceId(tx, roomId, placeId);
        return cards.length > 0;
    }

    async listByRoomIdAndPlaceId(tx: PgClient, roomId: string, placeId: string): Promise<(RoomPlaceCard$ & {
        rank: string,
        suit: string,
    })[]> {
        const cards = await selectAll<RoomPlaceCard$ & {
            rank: string,
            suit: string,
        }>(tx,
            `SELECT rpc.*,
                    mc."rank" AS "rank",
                    mc."suit" AS "suit"
             FROM "RoomPlaceCard" AS rpc
                      JOIN "MasterCard" AS mc ON mc."card_id" = rpc."master_card_id"
             WHERE rpc."room_id" = $1
               AND rpc."room_place_id" = $2`,
            [roomId, placeId],
        );
        cards.sort((a, b) => compareString(a.room_place_card_id, b.room_place_card_id));
        return cards;
    }

    async createInRoomPlace(tx: PgClient, roomId: string, placeId: string, cards: {
        cardId: string,
        masterCardId: string,
        side: string,
    }[], t: Date): Promise<void> {
        await RoomPlaceCard$.insert(tx, ...cards.map(c => ({
            room_place_card_id: c.cardId,
            room_place_id: placeId,
            room_id: roomId,
            master_card_id: c.masterCardId,
            side: c.side,
            create_time: t,
            update_time: t,
        })));
    }

    async update(tx: PgClient, card: RoomPlaceCard$): Promise<void> {
        await RoomPlaceCard$.update(tx, card);
    }
}