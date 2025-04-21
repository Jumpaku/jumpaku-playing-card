import {Request, Response} from "express";
import {Injectable} from "@nestjs/common";
import {create, enumFromJson, enumToJson} from "@bufbuild/protobuf";
import {PlayServiceService} from "../../../../../../../gen/pb/api/v1/app/room/play/service/PlayService_rb.service";
import {RandomProvider} from "../../../../../../global/random.provider";
import {PostgresProvider, selectAll} from "../../../../../../global/postgres.provider";
import {RequestTimeProvider} from "../../../../../../global/request_time.provider";
import {RequestSessionProvider} from "../../../../../../global/request_session.provider";
import {UserProvider} from "../../../../../../shared/user/user.provider";
import {
    ListPlaceRequest,
    ListPlaceResponse,
    CreatePlaceRequest,
    CreatePlaceResponse,
    DeletePlaceRequest,
    DeletePlaceResponse,
    MoveCardRequest,
    MoveCardResponse,
    GetHistoryRequest,
    GetHistoryResponse,
    CreatePlaceResponseSchema,
    PlaceSchema,
    DeletePlaceResponseSchema,
    Place_Type,
    MoveCardResponseSchema,
    Card_Side,
    AddDeckRequest,
    AddDeckResponse,
    AddDeckResponseSchema,
    ListPlaceResponseSchema,
    Place_TypeSchema,
    Place_TypeJson,
    CardSchema,
    Card_SideSchema, Card_SideJson
} from "src/gen/pb/api/v1/app/room/play/service_pb";
import {throwBadRequest, throwPreconditionFailed} from "../../../../../../../exception/exception";
import {RoomMember$} from "../../../../../../../gen/pg/dao/dao_RoomMember";
import {RoomPlace$} from "../../../../../../../gen/pg/dao/dao_RoomPlace";
import {RoomSeat$} from "../../../../../../../gen/pg/dao/dao_RoomSeat";
import {RoomPlaceCard$} from "../../../../../../../gen/pg/dao/dao_RoomPlaceCard";
import {compareString} from "../../../../../../../lib/compare";
import {MasterCard$} from "../../../../../../../gen/pg/dao/dao_MasterCard";

@Injectable()
export class PlayService extends PlayServiceService {
    constructor(
        private readonly random: RandomProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly requestSession: RequestSessionProvider,
        private readonly user: UserProvider,
    ) {
        super();
    }

    override async handleListPlace(input: ListPlaceRequest, req: Request, res: Response): Promise<ListPlaceResponse> {
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }
        return await this.postgres.transaction(async (tx) => {
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }

            const m = (await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
                user_id: u.user_id,
            }));
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }

            const s = await RoomSeat$.findByUq_RoomSeat_RoomMember(tx, {
                room_id: input.roomId,
                room_member_id: m.room_member_id,
            });

            const placeList = await RoomPlace$.listByIdx_RoomPlace_RoomIdAndPlaceId(tx, {room_id: input.roomId});

            const responsePlaceList = placeList.map(async (place) => {
                const others = place.owner_seat_id != null && place.owner_seat_id !== s?.room_seat_id;
                const hand = place.type === enumToJson(Place_TypeSchema, Place_Type.HAND);

                const cardList = await selectAll<RoomPlaceCard$ & {
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
                    [input.roomId, place.room_place_id],
                );

                const responseCardList = cardList.map((card) => {
                    const hide = (others && hand) || card.side === enumToJson(Card_SideSchema, Card_Side.BACK);
                    return hide ?
                        create(CardSchema, {side: Card_Side.BACK}) :
                        create(CardSchema, {
                            side: enumFromJson(Card_SideSchema, card.side as Card_SideJson),
                            masterCardId: card.master_card_id,
                            cardRank: card.rank,
                            cardSuit: card.suit,
                        });
                })

                return create(PlaceSchema, {
                    placeId: place.room_place_id,
                    owned: place.owner_seat_id != null,
                    ownerSeatId: place.owner_seat_id ?? undefined,
                    type: enumFromJson(Place_TypeSchema, place.type as Place_TypeJson),
                    cardList: responseCardList,
                })
            })

            return create(ListPlaceResponseSchema, {placeList: await Promise.all(responsePlaceList)});
        });
    }

    override async handleCreatePlace(input: CreatePlaceRequest, req: Request, res: Response): Promise<CreatePlaceResponse> {
        if(input.type === Place_Type.HAND && !input.owned) {
            throwBadRequest("Invalid owned place type", "Invalid owned place type: hand place must be owned");
        }
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
            const m = await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
                user_id: u.user_id,
            });
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }
            const p: RoomPlace$ = {
                room_id: input.roomId,
                create_time: t,
                update_time: t,
                room_place_id: this.random.uuid(),
                display_name: input.placeName,
                type: enumToJson(Place_TypeSchema, input.type),
                owner_seat_id: null,
            };
            if (input.owned) {
                const s = await RoomSeat$.find(tx, {room_seat_id: input.ownerSeatId});
                if (s == null) {
                    throwPreconditionFailed("Seat not found", "Seat not found");
                }
                p.owner_seat_id = input.ownerSeatId;
            }
            await RoomPlace$.insert(tx, p);

            return create(CreatePlaceResponseSchema, {
                place: create(PlaceSchema, {
                    placeId: p.room_place_id,
                    owned: input.owned,
                    ownerSeatId: p.owner_seat_id ?? undefined,
                    type: input.type,
                }),
            });
        });
    }

    override async handleDeletePlace(input: DeletePlaceRequest, req: Request, res: Response): Promise<DeletePlaceResponse> {
        const sessionId = this.requestSession.extract(req);
        if (sessionId == null) {
            throwPreconditionFailed("Session not found", "Session not found");
        }
        return await this.postgres.transaction(async (tx) => {
            const u = await this.user.findUserBySessionId(tx, sessionId);
            if (u == null) {
                throwPreconditionFailed("User not found", "User not found");
            }
            const m = await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
                user_id: u.user_id,
            });
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }

            const cards = await RoomPlaceCard$.listByIdx_RoomPlaceCard_RoomIdAndPlaceIdAndCardId(tx, {
                room_id: input.roomId,
                room_place_id: input.placeId
            });
            if (cards.length > 0) {
                throwPreconditionFailed("Place not empty", "Place not empty");
            }

            await RoomPlace$.delete(tx, {room_place_id: input.placeId});

            return create(DeletePlaceResponseSchema, {});
        });
    }

    override async handleAddDeck(input: AddDeckRequest, req: Request, res: Response): Promise<AddDeckResponse> {
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
            const m = await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
                user_id: u.user_id,
            });
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }

            const deck = await selectAll<MasterCard$>(tx,
                `SELECT *
                 FROM "MasterCard"`,
                [],
            );

            const found = await RoomPlace$.listByIdx_RoomPlace_RoomIdAndPlaceId(tx, {
                room_id: input.roomId,
                room_place_id: input.placeId,
            });
            if (found.length === 0) {
                throwPreconditionFailed("Place not found", "Place not found");
            }

            await RoomPlaceCard$.insert(tx, ...deck.map(master => ({
                room_place_card_id: this.random.uuid(),
                room_place_id: input.placeId,
                room_id: input.roomId,
                master_card_id: master.card_id,
                side: enumToJson(Card_SideSchema, Card_Side.BACK),
                create_time: t,
                update_time: t,
            })));

            return create(AddDeckResponseSchema, {});
        });
    }

    override async handleMoveCard(input: MoveCardRequest, req: Request, res: Response): Promise<MoveCardResponse> {
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
            const m = await RoomMember$.findByUq_RoomMember_RoomUser(tx, {
                room_id: input.roomId,
                user_id: u.user_id,
            });
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }

            const source_cards = await RoomPlaceCard$.listByIdx_RoomPlaceCard_RoomIdAndPlaceIdAndCardId(tx, {
                room_id: input.roomId,
                room_place_id: input.placeId,
            });
            source_cards.sort((a, b) => compareString(a.room_place_card_id, b.room_place_card_id));

            const srcCardIndex = input.moveList.map(({sourceCardIndex}) => sourceCardIndex);
            if (srcCardIndex.some(idx => idx >= source_cards.length)) {
                throwPreconditionFailed("Invalid source card index", "Invalid source card index");
            }
            if (new Set(srcCardIndex).size !== srcCardIndex.length) {
                throwPreconditionFailed("Duplicate source card index", "Duplicate source card index");
            }

            const moves = input.moveList.map(async ({sourceCardIndex, destinationPlaceId, destinationCardSide}) => {
                const card = source_cards[sourceCardIndex];
                await RoomPlaceCard$.delete(tx, {room_place_card_id: card.room_place_card_id});

                const dstPlace = await RoomPlace$.find(tx, {room_place_id: destinationPlaceId});
                if (dstPlace == null) {
                    throwPreconditionFailed("Destination place not found", "Destination place not found");
                }

                card.room_place_id = destinationPlaceId;
                card.side = enumToJson(Card_SideSchema, destinationCardSide);
                card.update_time = t;

                await RoomPlaceCard$.insert(tx, card);
            });

            await Promise.all(moves);

            return create(MoveCardResponseSchema, {});
        });
    }

    override async handleGetHistory(input: GetHistoryRequest, req: Request, res: Response): Promise<GetHistoryResponse> {
        throw new Error("Method not implemented.");
    }

}
