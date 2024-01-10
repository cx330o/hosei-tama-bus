require("dotenv").config();

const PORT = process.env.PORT || 9003;

let SQLITE_URL;
let FILE_PATH;

switch (process.env.NODE_ENV) {
  case "test":
    SQLITE_URL = process.env.TEST_SQLITE_URL;
    FILE_PATH = process.env.TEST_FILE_PATH;
    break;
  case "development":
    SQLITE_URL = process.env.DEV_SQLITE_URL;
    FILE_PATH = process.env.DEV_FILE_PATH;
    break;
  case "production":
    SQLITE_URL = process.env.SQLITE_URL;
    FILE_PATH = process.env.FILE_PATH;
    break;
}

const MESSAGE_LIFETIME_HOURS = parseInt(process.env.MESSAGE_LIFETIME_HOURS, 10) || 24;

module.exports = { PORT, SQLITE_URL, FILE_PATH, MESSAGE_LIFETIME_HOURS };
