CREATE TABLE Example
(
    example_id  TEXT      NOT NULL,
    name        TEXT      NOT NULL,
    create_time TIMESTAMP NOT NULL,
    update_time TIMESTAMP NOT NULL,
    content     TEXT      NOT NULL,
    PRIMARY KEY (example_id)
);