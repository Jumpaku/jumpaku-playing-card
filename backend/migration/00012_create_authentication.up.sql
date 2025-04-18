CREATE TABLE "Authentication"
(
    "authentication_id" TEXT                     NOT NULL,
    "auth_method"       TEXT                     NOT NULL,
    "create_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("authentication_id"),
    CONSTRAINT "Ck_Authentication_AuthMethod" CHECK ("auth_method" IN ('password', 'temporary'))
);