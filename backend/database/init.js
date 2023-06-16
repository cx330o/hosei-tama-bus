// Initialize the database if it doesn't exist.
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbPath = process.argv[2];
const sqlFile = process.argv[3];

if (!dbPath || !sqlFile) {
  console.error("Usage: node init.js <db-path> <sql-file>");
  process.exit(1);
}

// Ensure parent directories exist
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

if (fs.existsSync(dbPath)) {
  console.log(`Database already exists at ${dbPath}, skipping init.`);
  process.exit(0);
}

const sql = fs.readFileSync(sqlFile, "utf-8");
const db = new Database(dbPath);
db.exec(sql);
db.close();

console.log(`Database initialized at ${dbPath}`);
