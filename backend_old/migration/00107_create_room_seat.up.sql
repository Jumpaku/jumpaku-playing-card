CREATE TABLE "RoomSeat"
(
    "room_seat_id"   TEXT                     NOT NULL,
    "room_id"        TEXT                     NOT NULL,
    "room_seat_name" TEXT                     NOT NULL,
    "room_member_id" TEXT,
    "create_time"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"    TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "Uq_RoomSeat_RoomMember" UNIQUE ("room_id", "room_member_id"),
    CONSTRAINT "Fk_RoomSeat_Room" FOREIGN KEY ("room_id") REFERENCES "Room" ("room_id"),
    CONSTRAINT "Fk_RoomSeat_RoomMember" FOREIGN KEY ("room_member_id") REFERENCES "RoomMember" ("room_member_id"),
    PRIMARY KEY ("room_seat_id")
);