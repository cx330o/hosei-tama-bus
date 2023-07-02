const db = require("../utils/db");

function createMessage(text) {
  const creationTime = new Date().toISOString();
  const expirationTime = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();

  const stmt = db.prepare(
    `INSERT INTO Message (creation_time, expiration_time, text) VALUES (?, ?, ?)`
  );
  const result = stmt.run(creationTime, expirationTime, text);
  return result.lastInsertRowid;
}

function getMessages() {
  const currentTime = new Date().toISOString();
  const sql = `SELECT
    m.id as message_id,
    m.creation_time as message_creation_time,
    m.text as message_text
  FROM Message m
  WHERE m.expiration_time > ?
  ORDER BY m.creation_time DESC`;

  return db.prepare(sql).all(currentTime);
}

module.exports = {
  createMessage,
  getMessages,
};
