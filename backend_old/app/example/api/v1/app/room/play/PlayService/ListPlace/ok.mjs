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

await session.post(`/api/v1/app/room/${room.roomId}/play/place`, {
    body: {
        roomId: room.roomId,
        placeName: 'owned hand place',
        type: 'TYPE_HAND',
        owned: true,
        ownerSeatId: room.seatList[0].seatId,
    },
});
await session.post(`/api/v1/app/room/${room.roomId}/play/place`, {
    body: {
        roomId: room.roomId,
        placeName: 'owned table place',
        type: 'TYPE_TABLE',
        owned: true,
        ownerSeatId: room.seatList[0].seatId,
    },
});
await session.post(`/api/v1/app/room/${room.roomId}/play/place`, {
    body: {
        roomId: room.roomId,
        placeName: 'common table place',
        type: 'TYPE_TABLE',
        owned: false,
    },
});
await session.post(`/api/v1/app/room/${room.roomId}/play/place`, {
    body: {
        roomId: room.roomId,
        placeName: 'common deck place',
        type: 'TYPE_DECK',
        owned: false,
    },
});
await session.get(`/api/v1/app/room/${room.roomId}/play/place`);


