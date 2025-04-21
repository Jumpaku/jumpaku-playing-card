#!/usr/bin/env node

import {Session} from "../../../../../../http.mjs"

const session = new Session();

await session.newUser();

const room = await session.post(`/api/v1/app/room`, {
    body: {
        roomName: 'my room name',
        seatCount: 4,
    },
});

await session.get(`/api/v1/app/room/${room.roomId}`);
await session.put(`/api/v1/app/room/${room.roomId}/seat/${room.seatList[0].seatId}/take`);
await session.put(`/api/v1/app/room/${room.roomId}/seat/${room.seatList[1].seatId}/take`);
await session.get(`/api/v1/app/room/${room.roomId}`);
