CREATE TABLE "MasterPermission"
(
    "permission_id"   TEXT NOT NULL,
    "permission_name" TEXT NOT NULL,
    CONSTRAINT Uk_MasterPermission_Name UNIQUE ("permission_name"),
    PRIMARY KEY ("permission_id")
);