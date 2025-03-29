CREATE TABLE "Permission"
(
    "permission_id" TEXT                     NOT NULL,
    "name"          TEXT                     NOT NULL,
    "create_time"   TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"   TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT Uk_Permission_Name UNIQUE ("name"),
    PRIMARY KEY ("permission_id")
);