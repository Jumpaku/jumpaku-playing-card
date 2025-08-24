CREATE TABLE "RoomPlace"
(
    "room_place_id" TEXT                     NOT NULL,
    "room_id"       TEXT                     NOT NULL,
    "display_name"  TEXT                     NOT NULL,
    "type"          TEXT                     NOT NULL,
    "owner_seat_id" TEXT,
    "create_time"   TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"   TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "Fk_Place_Room" FOREIGN KEY ("room_id") REFERENCES "Room" ("room_id"),
    CONSTRAINT "Ck_Place_Type" CHECK ("type" IN ('TYPE_DECK', 'TYPE_TABLE', 'TYPE_HAND')),
    CONSTRAINT "Ck_Place_Owner" CHECK ("type" IN ('TYPE_DECK', 'TYPE_TABLE') OR "owner_seat_id" IS NOT NULL),
    CONSTRAINT "Fk_Place_OwnerSeat" FOREIGN KEY ("owner_seat_id") REFERENCES "RoomSeat" ("room_seat_id"),
    PRIMARY KEY ("room_place_id")
);
