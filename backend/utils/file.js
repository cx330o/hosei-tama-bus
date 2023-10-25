const fs = require("fs");
const path = require("path");
const config = require("./config");

function deleteFile(fileName) {
  const filePath = path.join(config.FILE_PATH, fileName);
  try {
    fs.unlinkSync(filePath);
    console.log(`Successfully deleted file: ${filePath}`);
  } catch (err) {
    console.error(`Failed to delete file: ${filePath}`, err);
  }
}

module.exports = { deleteFile };
