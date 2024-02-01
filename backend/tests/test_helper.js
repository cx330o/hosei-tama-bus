const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const config = require("../utils/config");

function ensureTestDirs() {
  const testDataDir = path.dirname(config.SQLITE_URL);
  const testUploadsDir = config.FILE_PATH;
  fs.mkdirSync(testDataDir, { recursive: true });
  fs.mkdirSync(testUploadsDir, { recursive: true });
}

function initTestDb() {
  ensureTestDirs();
  if (fs.existsSync(config.SQLITE_URL)) fs.unlinkSync(config.SQLITE_URL);
  const initSql = fs.readFileSync(path.join(__dirname, "../database/test_init.sql"), "utf-8");
  const db = new Database(config.SQLITE_URL);
  db.exec(initSql);
  db.close();
}

function cleanTestUploads() {
  const uploadsDir = config.FILE_PATH;
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const file of files) fs.unlinkSync(path.join(uploadsDir, file));
  }
}

module.exports = { initTestDb, cleanTestUploads };
