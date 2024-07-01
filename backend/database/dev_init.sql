-- Initialize development database with sample data

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

-- Sample messages
INSERT INTO Message (id, creation_time, expiration_time, text) VALUES
(1, '2026-03-31T08:00:00.000Z', '2036-04-01T08:00:00.000Z', 'Meeting notes from today - remember to review the API docs before Friday.');

INSERT INTO Message (id, creation_time, expiration_time, text) VALUES
(2, '2026-03-31T09:15:00.000Z', '2036-04-01T09:15:00.000Z', '<p>Quick <strong>deployment checklist</strong>:</p><ul><li>Run tests</li><li>Build Docker image</li><li>Push to registry</li></ul>');

INSERT INTO Message (id, creation_time, expiration_time) VALUES
(3, '2026-03-31T10:30:00.000Z', '2036-04-01T10:30:00.000Z');
