CREATE TABLE "Role"
(
    "role_id"     TEXT                     NOT NULL,
    "name"        TEXT                     NOT NULL,
    "create_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT Uk_Role_Name UNIQUE ("name"),
    PRIMARY KEY ("role_id")
);