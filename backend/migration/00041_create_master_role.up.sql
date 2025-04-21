CREATE TABLE "MasterRole"
(
    "role_id"   TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    CONSTRAINT "Uk_MasterRole_Name" UNIQUE ("role_name"),
    PRIMARY KEY ("role_id")
);