const Database = require("better-sqlite3");

const SQLITE_URL = process.env.SQLITE_URL || "./database/fastsend.sqlite";

const db = new Database(SQLITE_URL);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

console.log(`Connected to the database: ${SQLITE_URL}`);

module.exports = db;
