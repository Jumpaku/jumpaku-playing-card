CREATE TABLE "RoomBan"
(
    "room_ban_id" TEXT                     NOT NULL,
    "room_id"     TEXT                     NOT NULL,
    "ban_user_id" TEXT                     NOT NULL,
    "create_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "Uq_RoomBan_RoomUser" UNIQUE ("room_id", "ban_user_id"),
    CONSTRAINT "Fk_RoomBan_Room" FOREIGN KEY ("room_id") REFERENCES "Room" ("room_id"),
    CONSTRAINT "Fk_RoomBan_User" FOREIGN KEY ("ban_user_id") REFERENCES "User" ("user_id"),
    PRIMARY KEY ("room_ban_id")
);