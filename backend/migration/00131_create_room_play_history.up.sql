CREATE TABLE "RoomPlayHistory"
(
    "room_play_history_id"  TEXT                     NOT NULL,
    "room_id"               TEXT                     NOT NULL,
    "entry_order"           INTEGER                  NOT NULL,
    "operator_member_id"    TEXT                     NOT NULL,
    "operator_seat_id"      TEXT                     NOT NULL,
    "operation"             TEXT                     NOT NULL,
    "room_place_id"         TEXT                     NOT NULL,
    "source_card_index"     INTEGER,
    "destination_place_id"  TEXT,
    "destination_card_side" TEXT,
    "create_time"           TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"           TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT Fk_RoomPlayHistory_Room FOREIGN KEY ("room_id") REFERENCES "Room" ("room_id"),
    CONSTRAINT Ck_RoomPlayHistory_Operation CHECK ("operation" IN ('CREATE_PLACE', 'DELETE_PLACE', 'MOVE')),
    CONSTRAINT Ck_RoomPlayHistory_Side CHECK ("destination_card_side" IS NULL OR
                                              "destination_card_side" IN ('FRONT', 'BACK')),
    PRIMARY KEY ("room_play_history_id")
);

