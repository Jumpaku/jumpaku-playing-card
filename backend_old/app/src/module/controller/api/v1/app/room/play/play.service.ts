import {Request, Response} from "express";
import {Injectable} from "@nestjs/common";
import {create, enumFromJson, enumToJson} from "@bufbuild/protobuf";
import {PlayServiceService} from "../../../../../../../gen/pb/api/v1/app/room/play/service/PlayService_rb.service";
import {RandomProvider} from "../../../../../../global/random.provider";
import {PostgresProvider} from "../../../../../../global/postgres.provider";
import {RequestTimeProvider} from "../../../../../../global/request_time.provider";
import {RequestSessionProvider} from "../../../../../../global/request_session.provider";
import {UserRepository} from "../../../../../../shared/user/user.repository";
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
import {MemberRepository} from "./member.repository";
import {PlaceRepository} from "./place.repository";
import {MasterCardRepository} from "./master_card.repository";
import {CardRepository} from "./card.repository";
import {SeatRepository} from "./seat.repository";

@Injectable()
export class PlayService extends PlayServiceService {
    constructor(
        private readonly random: RandomProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
        private readonly requestSession: RequestSessionProvider,
        private readonly user: UserRepository,
        private readonly member: MemberRepository,
        private readonly seat: SeatRepository,
        private readonly place: PlaceRepository,
        private readonly card: CardRepository,
        private readonly masterCard: MasterCardRepository,
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
            const m = await this.member.findByRoomIdAndUserId(tx, input.roomId, u.user_id);
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }
            const s = await this.seat.findByRoomIdAndMemberId(tx, input.roomId, m.room_member_id);

            const placeList = await this.place.list(tx, input.roomId);

            const responsePlaceList = placeList.map(async (place) => {
                const others = place.owner_seat_id != null && place.owner_seat_id !== s?.room_seat_id;
                const hand = place.type === enumToJson(Place_TypeSchema, Place_Type.HAND);

                const cardList = await this.card.listByRoomIdAndPlaceId(tx, input.roomId, place.room_place_id);
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
        if (input.type === Place_Type.HAND && !input.owned) {
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
            const m = await this.member.findByRoomIdAndUserId(tx, input.roomId, u.user_id);
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }

            const placeId = this.random.uuid();
            let ownerSeatId: string | null = null;
            if (input.owned) {
                if (!await this.seat.existsInRoom(tx, input.roomId, input.ownerSeatId)) {
                    throwPreconditionFailed("Seat not found", "Seat not found");
                }
                ownerSeatId = input.ownerSeatId;
            }
            await this.place.create(tx, input.roomId, placeId, input.placeName, enumToJson(Place_TypeSchema, input.type), ownerSeatId, t);

            return create(CreatePlaceResponseSchema, {
                place: create(PlaceSchema, {
                    placeId: placeId,
                    owned: input.owned,
                    ownerSeatId: input.owned ? ownerSeatId! : undefined,
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
            const m = await this.member.findByRoomIdAndUserId(tx, input.roomId, u.user_id);
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }

            if (await this.card.existsInRoomPlace(tx, input.roomId, input.placeId)) {
                throwPreconditionFailed("Place not empty", "Place not empty");
            }

            await this.place.delete(tx, input.roomId, input.placeId);

            return create(DeletePlaceResponseSchema);
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
            const m = await this.member.findByRoomIdAndUserId(tx, input.roomId, u.user_id);
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }
            if (!await this.place.exists(tx, input.roomId, input.placeId)) {
                throwPreconditionFailed("Place not found", "Place not found");
            }

            const deck = await this.masterCard.deck(tx);
            await this.card.createInRoomPlace(tx, input.roomId, input.placeId, deck.map(master => ({
                cardId: this.random.uuid(),
                masterCardId: master.card_id,
                side: enumToJson(Card_SideSchema, Card_Side.BACK),
            })), t);

            return create(AddDeckResponseSchema);
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
            const m = await this.member.findByRoomIdAndUserId(tx, input.roomId, u.user_id);
            if (m == null) {
                throwPreconditionFailed("Not a room member", "Not a room member");
            }

            const sourceCards = await this.card.listByRoomIdAndPlaceId(tx, input.roomId, input.placeId);
            const srcCardIndex = input.moveList.map(({sourceCardIndex}) => sourceCardIndex);
            if (srcCardIndex.some(idx => idx < 0 || idx >= sourceCards.length)) {
                throwPreconditionFailed("Invalid source card index", "Invalid source card index");
            }
            if (new Set(srcCardIndex).size !== srcCardIndex.length) {
                throwPreconditionFailed("Duplicate source card index", "Duplicate source card index");
            }

            const moves = input.moveList.map(async ({sourceCardIndex, destinationPlaceId, destinationCardSide}) => {
                if (!await this.place.exists(tx, input.roomId, destinationPlaceId)) {
                    throwPreconditionFailed("Destination place not found", "Destination place not found");
                }
                await this.card.update(tx, {
                    ...sourceCards[sourceCardIndex],
                    room_place_id: destinationPlaceId,
                    side: enumToJson(Card_SideSchema, destinationCardSide),
                    update_time: t,
                });
            });

            await Promise.all(moves);

            return create(MoveCardResponseSchema, {});
        });
    }

    override async handleGetHistory(input: GetHistoryRequest, req: Request, res: Response): Promise<GetHistoryResponse> {
        throw new Error("Method not implemented.");
    }

}
