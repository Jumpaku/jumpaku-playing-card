CREATE TABLE "AuthenticationPassword"
(
    "authentication_id" TEXT                     NOT NULL,
    "login_id"          TEXT                     NOT NULL,
    "password_salt"     TEXT                     NOT NULL,
    "password_hash"     TEXT                     NOT NULL,
    "create_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("authentication_id"),
    CONSTRAINT "Uk_AuthenticationPassword_LoginId" UNIQUE ("login_id"),
    CONSTRAINT "Fk_AuthenticationPassword_Authentication" FOREIGN KEY ("authentication_id") REFERENCES "Authentication" ("authentication_id")
);