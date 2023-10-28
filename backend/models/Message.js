const db = require("../utils/db");
const { deleteFileByMessageId } = require("../models/File");

function createMessage(text) {
  const creationTime = new Date().toISOString();
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const stmt = db.prepare(`INSERT INTO Message (creation_time, expiration_time, text) VALUES (?, ?, ?)`);
  const result = stmt.run(creationTime, expirationTime, text);
  return result.lastInsertRowid;
}

function groupRows(rows) {
  return rows.reduce((acc, row) => {
    let message = acc.find((m) => m.message_id === row.message_id);
    if (!message) {
      message = { message_id: row.message_id, message_creation_time: row.message_creation_time, message_text: row.message_text, message_files: [] };
      acc.push(message);
    }
    if (row.file_id) {
      message.message_files.push({ file_id: row.file_id, file_type: row.file_type, file_size: row.file_size, file_name: row.file_name, file_original_name: row.file_original_name });
    }
    return acc;
  }, []);
}

function getMessages({ cursor, limit = 20 } = {}) {
  const currentTime = new Date().toISOString();
  let idSql = `SELECT DISTINCT m.id FROM Message m WHERE m.expiration_time > ?`;
  const idParams = [currentTime];
  if (cursor) { idSql += ` AND m.creation_time < ?`; idParams.push(cursor); }
  idSql += ` ORDER BY m.creation_time DESC LIMIT ?`;
  idParams.push(limit + 1);
  const idRows = db.prepare(idSql).all(...idParams);
  const hasMore = idRows.length > limit;
  const messageIds = idRows.slice(0, limit).map((r) => r.id);
  if (messageIds.length === 0) return { messages: [], hasMore: false, nextCursor: null };
  const placeholders = messageIds.map(() => "?").join(",");
  const dataSql = `SELECT m.id as message_id, m.creation_time as message_creation_time, m.text as message_text, f.id as file_id, f.file_type, f.file_size, f.file_name, f.file_original_name FROM Message m LEFT JOIN File f ON m.id = f.message_id WHERE m.id IN (${placeholders}) ORDER BY m.creation_time DESC`;
  const rows = db.prepare(dataSql).all(...messageIds);
  const messages = groupRows(rows);
  messages.sort((a, b) => Date.parse(b.message_creation_time) - Date.parse(a.message_creation_time));
  const lastMessage = messages[messages.length - 1];
  const nextCursor = hasMore ? lastMessage.message_creation_time : null;
  return { messages, hasMore, nextCursor };
}

function getMessage(messageId) {
  const sql = `SELECT m.id as message_id, m.creation_time as message_creation_time, m.text as message_text, f.id as file_id, f.file_type, f.file_size, f.file_name, f.file_original_name FROM Message m LEFT JOIN File f ON m.id = f.message_id WHERE m.id = ?`;
  const rows = db.prepare(sql).all(messageId);
  if (rows.length === 0) return { message_id: null, message_creation_time: null, message_text: null, message_files: [] };
  return groupRows(rows)[0];
}

function deleteMessage(messageId) {
  deleteFileByMessageId(messageId);
  db.prepare(`DELETE FROM Message WHERE id = ?`).run(messageId);
}

module.exports = { createMessage, getMessages, getMessage, deleteMessage };
