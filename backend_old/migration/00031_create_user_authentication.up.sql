CREATE TABLE "UserAuthentication"
(
    "user_authentication_id" TEXT                     NOT NULL,
    "user_id"                TEXT                     NOT NULL,
    "authentication_id"      TEXT                     NOT NULL,
    "create_time"            TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"            TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("user_authentication_id"),
    CONSTRAINT "Fk_UserAuthentication_User" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id"),
    CONSTRAINT "Fk_UserAuthentication_Authentication" FOREIGN KEY ("authentication_id") REFERENCES "Authentication" ("authentication_id"),
    CONSTRAINT "Uk_UserAuthentication" UNIQUE ("user_id", "authentication_id")
);