CREATE TABLE "RoomSeat"
(
    "room_seat_id"        TEXT                     NOT NULL,
    "room_id"        TEXT                     NOT NULL,
    "display_name"   TEXT                     NOT NULL,
    "create_time"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"    TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT Fk_RoomSeat_Room FOREIGN KEY ("room_id") REFERENCES "Room" ("room_id"),
    PRIMARY KEY ("room_seat_id")
);