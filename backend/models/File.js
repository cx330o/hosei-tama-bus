const db = require("../utils/db");

function createFile(messageId, file) {
  const stmt = db.prepare(`INSERT INTO File (message_id, file_type, file_size, file_name, file_original_name) VALUES (?, ?, ?, ?, ?)`);
  const result = stmt.run(messageId, file.mimetype, file.size, file.filename, file.originalname);
  return result.lastInsertRowid;
}

function getOriginalFileNameByFileName(fileName) {
  const stmt = db.prepare(`SELECT file_original_name FROM File WHERE file_name = ?`);
  const row = stmt.get(fileName);
  return row ? row.file_original_name : null;
}

module.exports = { createFile, getOriginalFileNameByFileName };
