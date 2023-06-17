require("dotenv").config();

const PORT = process.env.PORT || 9003;

let SQLITE_URL;

switch (process.env.NODE_ENV) {
  case "development":
    SQLITE_URL = process.env.DEV_SQLITE_URL;
    break;
  case "production":
    SQLITE_URL = process.env.SQLITE_URL;
    break;
  default:
    SQLITE_URL = "./database/fastsend.sqlite";
}

module.exports = { PORT, SQLITE_URL };
