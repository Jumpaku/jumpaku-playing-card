CREATE TABLE "RoomMember"
(
    "room_member_id" TEXT                     NOT NULL,
    "room_id"        TEXT                     NOT NULL,
    "user_id"        TEXT                     NOT NULL,
    "role_id"        TEXT                     NOT NULL,
    "create_time"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"    TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT Fk_RoomMember_Room FOREIGN KEY ("room_id") REFERENCES "Room" ("room_id"),
    CONSTRAINT Fk_RoomMember_User FOREIGN KEY ("user_id") REFERENCES "User" ("user_id"),
    CONSTRAINT Fk_RoomMember_Role FOREIGN KEY ("role_id") REFERENCES "MasterRoomMemberRole" ("room_member_role_id"),
    PRIMARY KEY ("room_member_id")
);