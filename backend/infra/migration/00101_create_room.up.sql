CREATE TABLE "Room"
(
    "room_id"     TEXT                     NOT NULL,
    "room_name"   TEXT                     NOT NULL,
    "create_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("room_id")
);