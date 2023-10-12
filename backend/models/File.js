const db = require("../utils/db");

function createFile(messageId, file) {
  const stmt = db.prepare(
    `INSERT INTO File (message_id, file_type, file_size, file_name, file_original_name) VALUES (?, ?, ?, ?, ?)`
  );
  const result = stmt.run(messageId, file.mimetype, file.size, file.filename, file.originalname);
  return result.lastInsertRowid;
}

module.exports = { createFile };
