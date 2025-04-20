CREATE TABLE "RoomPlaceCard"
(
    "room_place_card_id" TEXT                     NOT NULL,
    "room_place_id"      TEXT                     NOT NULL,
    "room_id"            TEXT                     NOT NULL,
    "card_id"            TEXT                     NOT NULL,
    "side"               TEXT                     NOT NULL,
    "master_card_id"     TEXT                     NOT NULL,
    "create_time"        TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"        TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT Fk_RoomPlaceCard_RoomPlace FOREIGN KEY ("room_place_id") REFERENCES "RoomPlace" ("room_place_id"),
    CONSTRAINT Fk_RoomPlaceCard_Room FOREIGN KEY ("room_id") REFERENCES "Room" ("room_id"),
    CONSTRAINT Ck_RoomPlaceCard_Side CHECK ("side" IN ('FRONT', 'BACK')),
    CONSTRAINT Fk_RoomPlaceCard_MasterCard FOREIGN KEY ("master_card_id") REFERENCES "MasterCard" ("card_id"),
    PRIMARY KEY ("room_place_card_id")
);
