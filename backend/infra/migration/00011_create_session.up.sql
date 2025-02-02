CREATE TABLE "Session"
(
    "session_id"  TEXT                     NOT NULL,
    "expire_time" TIMESTAMP WITH TIME ZONE,
    "create_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("session_id")
);