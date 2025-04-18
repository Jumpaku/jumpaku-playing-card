CREATE TABLE "MasterRolePermission"
(
    "role_permission_id" TEXT NOT NULL,
    "role_id"            TEXT NOT NULL,
    "permission_id"      TEXT NOT NULL,
    CONSTRAINT Fk_MasterRolePermission_MasterRole FOREIGN KEY ("role_id") REFERENCES "MasterRole" ("role_id"),
    CONSTRAINT Fk_MasterRolePermission_MasterPermission FOREIGN KEY ("permission_id") REFERENCES "MasterPermission" ("permission_id"),
    PRIMARY KEY ("role_permission_id")
);