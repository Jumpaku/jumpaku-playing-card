CREATE TABLE "Session"
(
    "session_id"        TEXT                     NOT NULL,
    "authentication_id" TEXT                     NOT NULL,
    "expire_time"       TIMESTAMP WITH TIME ZONE,
    "create_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("session_id"),
    CONSTRAINT "Fk_Session_Authentication" FOREIGN KEY ("authentication_id") REFERENCES "Authentication" ("authentication_id") ON DELETE CASCADE
);