CREATE TABLE "RolePermission"
(
    "role_permission_id" TEXT                     NOT NULL,
    "role_id"           TEXT                     NOT NULL,
    "permission_id"     TEXT                     NOT NULL,
    "create_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time"       TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT Fk_RolePermission_Role FOREIGN KEY ("role_id") REFERENCES "Role" ("role_id"),
    CONSTRAINT Fk_RolePermission_Permission FOREIGN KEY ("permission_id") REFERENCES "Permission" ("permission_id"),
    PRIMARY KEY ("role_permission_id")
);