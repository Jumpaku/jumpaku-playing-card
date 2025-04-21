#!/usr/bin/env node

import {Session} from "../../../../../../../http.mjs"

const session = new Session();

await session.newUser();

const room = await session.post({
    path: `/api/v1/app/room`,
    body: {
        roomName: 'my room name',
        seatCount: 4,
    },
});

await session.put({
    path: `/api/v1/app/room/${room.roomId}/seat/${room.seatList[0].seatId}/take`,
});
await session.get({
    path: `/api/v1/app/room/${room.roomId}`,
});

const seatList = []
seatList[0] = await session.post({
    path: `/api/v1/app/room/${room.roomId}/play/place`,
    body: {
        roomId: room.roomId,
        placeName: 'owned hand place',
        type: 'TYPE_HAND',
        owned: true,
        ownerSeatId: room.seatList[0].seatId,
    },
});
seatList[1] = await session.post({
    path: `/api/v1/app/room/${room.roomId}/play/place`,
    body: {
        roomId: room.roomId,
        placeName: 'owned table place',
        type: 'TYPE_TABLE',
        owned: true,
        ownerSeatId: room.seatList[0].seatId,
    },
});
seatList[2] = await session.post({
    path: `/api/v1/app/room/${room.roomId}/play/place`,
    body: {
        roomId: room.roomId,
        placeName: 'common table place',
        type: 'TYPE_TABLE',
        owned: false,
    },
});
seatList[3] = await session.post({
    path: `/api/v1/app/room/${room.roomId}/play/place`,
    body: {
        roomId: room.roomId,
        placeName: 'common deck place',
        type: 'TYPE_DECK',
        owned: false,
    },
});

await session.get({
    path: `/api/v1/app/room/${room.roomId}/play/place`,
});
await Promise.all(seatList.map(s => session.delete({
    path: `/api/v1/app/room/${room.roomId}/play/place/${s.place.placeId}`,
})));
await session.get({
    path: `/api/v1/app/room/${room.roomId}/play/place`,
});


