CREATE TABLE "Example"
(
    "example_id"  TEXT      NOT NULL,
    "name"        TEXT      NOT NULL,
    "create_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    "update_time" TIMESTAMP WITH TIME ZONE NOT NULL,
    "content"     TEXT      NOT NULL,
    PRIMARY KEY ("example_id")
);