const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const config = require("./config");

// Ensure the database directory exists
fs.mkdirSync(path.dirname(config.SQLITE_URL), { recursive: true });

const db = new Database(config.SQLITE_URL);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

console.log(`Connected to the database: ${config.SQLITE_URL}`);

module.exports = db;
