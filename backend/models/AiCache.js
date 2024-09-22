const db = require("../utils/db");

function getCachedResult(messageId, operation) {
  const stmt = db.prepare(
    `SELECT result FROM AiCache WHERE message_id = ? AND operation = ?`
  );
  const row = stmt.get(messageId, operation);
  return row ? row.result : null;
}

function getCachedImageResult(fileName, operation) {
  const stmt = db.prepare(
    `SELECT result FROM AiCache WHERE file_name = ? AND operation = ?`
  );
  const row = stmt.get(fileName, operation);
  return row ? row.result : null;
}

function cacheResult({ messageId, fileName, operation, result }) {
  const stmt = db.prepare(
    `INSERT INTO AiCache (message_id, file_name, operation, result, created_at) VALUES (?, ?, ?, ?, ?)`
  );
  stmt.run(messageId || null, fileName || null, operation, result, new Date().toISOString());
}

module.exports = { getCachedResult, getCachedImageResult, cacheResult };
