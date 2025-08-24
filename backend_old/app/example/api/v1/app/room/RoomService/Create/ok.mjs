#!/usr/bin/env node

import {Session} from "../../../../../../http.mjs"

const session = new Session();

await session.newUser();

await session.post(`/api/v1/app/room`, {
    body: {
        roomName: 'my room name',
        seatCount: 4,
    },
});
