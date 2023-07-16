require("dotenv").config();

const PORT = process.env.PORT || 9003;

let SQLITE_URL;
let FILE_PATH;

switch (process.env.NODE_ENV) {
  case "development":
    SQLITE_URL = process.env.DEV_SQLITE_URL;
    FILE_PATH = process.env.DEV_FILE_PATH;
    break;
  case "production":
    SQLITE_URL = process.env.SQLITE_URL;
    FILE_PATH = process.env.FILE_PATH;
    break;
  default:
    SQLITE_URL = "./database/fastsend.sqlite";
    FILE_PATH = "./uploads";
}

module.exports = { PORT, SQLITE_URL, FILE_PATH };
