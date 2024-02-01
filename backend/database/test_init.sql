DROP TABLE IF EXISTS File;
DROP TABLE IF EXISTS Message;

PRAGMA foreign_keys = ON;

CREATE TABLE Message (
    id INTEGER PRIMARY KEY NOT NULL,
    creation_time TEXT NOT NULL,
    expiration_time TEXT NOT NULL,
    text TEXT
);

CREATE TABLE File (
    id INTEGER PRIMARY KEY NOT NULL,
    message_id INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_original_name TEXT NOT NULL,
    FOREIGN KEY(message_id) REFERENCES Message(id)
);
