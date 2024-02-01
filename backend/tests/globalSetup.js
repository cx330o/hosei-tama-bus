const fs = require("fs");
const path = require("path");

module.exports = async function () {
  process.env.NODE_ENV = "test";
  const dbDir = path.join(__dirname, "../database/test_data");
  const uploadsDir = path.join(dbDir, "test_uploads");
  const dbPath = path.join(dbDir, "test_fastsend.sqlite");
  fs.mkdirSync(dbDir, { recursive: true });
  fs.mkdirSync(uploadsDir, { recursive: true });
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  const Database = require("better-sqlite3");
  const initSql = fs.readFileSync(path.join(__dirname, "../database/test_init.sql"), "utf-8");
  const db = new Database(dbPath);
  db.exec(initSql);
  db.close();
};
