CREATE TABLE "User"
(
    "user_id"      TEXT                     NOT NULL,
    "display_name" TEXT                     NOT NULL,
    "create_time"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"  TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("user_id")
);