const db = require("../utils/db");
const { deleteFile } = require("../utils/file");

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

function deleteFileByMessageId(messageId) {
  const files = db.prepare(`SELECT file_name FROM File WHERE message_id = ?`).all(messageId);
  for (const file of files) { deleteFile(file.file_name); }
  db.prepare(`DELETE FROM File WHERE message_id = ?`).run(messageId);
}

function getAllFileNames() {
  const rows = db.prepare(`SELECT file_name FROM File`).all();
  return rows.map((row) => row.file_name);
}

module.exports = { createFile, getOriginalFileNameByFileName, deleteFileByMessageId, getAllFileNames };
