CREATE TABLE "UserRole"
(
    "user_role_id" TEXT                     NOT NULL,
    "user_id"      TEXT                     NOT NULL,
    "role_id"           TEXT                     NOT NULL,
    "create_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "Fk_UserRole_User" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id"),
    CONSTRAINT "Fk_UserRole_MasterRole" FOREIGN KEY ("role_id") REFERENCES "MasterRole" ("role_id"),
    PRIMARY KEY ("user_role_id")
);