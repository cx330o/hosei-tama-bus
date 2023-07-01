const db = require("../utils/db");

function createMessage(text) {
  const creationTime = new Date().toISOString();
  // messages expire after 24 hours by default
  const expirationTime = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString();

  const stmt = db.prepare(
    `INSERT INTO Message (creation_time, expiration_time, text) VALUES (?, ?, ?)`
  );
  const result = stmt.run(creationTime, expirationTime, text);
  return result.lastInsertRowid;
}

module.exports = {
  createMessage,
};
