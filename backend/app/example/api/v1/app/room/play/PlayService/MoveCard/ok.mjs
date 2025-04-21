#!/usr/bin/env node

import {Session} from "../../../../../../../http.mjs"

const session = new Session();

await session.newUser();

const room = await session.post(`/api/v1/app/room`, {
    body: {
        roomName: 'my room name',
        seatCount: 4,
    },
});

await session.put(`/api/v1/app/room/${room.roomId}/seat/${room.seatList[0].seatId}/take`);
await session.get(`/api/v1/app/room/${room.roomId}`);

const deck = await session.post(`/api/v1/app/room/${room.roomId}/play/place`, {
    body: {
        roomId: room.roomId,
        placeName: 'common deck place',
        type: 'TYPE_DECK',
        owned: false,
    },
});
await session.post(`/api/v1/app/room/${room.roomId}/play/place/${deck.place.placeId}/deck`);

const hands = [];
for (const seat of room.seatList) {
    const res = await session.post(`/api/v1/app/room/${room.roomId}/play/place`, {
        body: {
            roomId: room.roomId,
            placeName: `hand of ${seat.seatId}`,
            type: 'TYPE_HAND',
            owned: true,
            ownerSeatId: seat.seatId,
        },
    });
    hands.push(res.place);
}

const moveList = [];
for (let i = 0; i < 54; i++) {
    moveList.push({
        sourceCardIndex: i,
        destinationPlaceId: hands[i % 4].placeId,
        destinationCardSide: 'SIDE_FRONT',
    });
}
await session.post(`/api/v1/app/room/${room.roomId}/play/place/${deck.place.placeId}/card/move`, {
    body: {moveList: moveList},
});

await session.get(`/api/v1/app/room/${room.roomId}/play/place`);


