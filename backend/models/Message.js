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

function getMessages({ cursor, limit = 20 } = {}) {
  const currentTime = new Date().toISOString();

  let sql = `SELECT
    m.id as message_id,
    m.creation_time as message_creation_time,
    m.text as message_text
  FROM Message m
  WHERE m.expiration_time > ?`;
  const params = [currentTime];

  if (cursor) {
    sql += ` AND m.creation_time < ?`;
    params.push(cursor);
  }

  sql += ` ORDER BY m.creation_time DESC LIMIT ?`;
  params.push(limit + 1);

  const rows = db.prepare(sql).all(...params);
  const hasMore = rows.length > limit;
  const messages = rows.slice(0, limit);

  const lastMessage = messages[messages.length - 1];
  const nextCursor = hasMore ? lastMessage.message_creation_time : null;

  return { messages, hasMore, nextCursor };
}

module.exports = {
  createMessage,
  getMessages,
};
