const multer = require("multer");
const path = require("path");
const config = require("./config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.FILE_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now().toString() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter(req, file, callback) {
    // Fix garbled Chinese filenames from multipart encoding
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    callback(null, true);
  },
});

module.exports = upload;
