const cron = require("node-cron");
const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const { getExpiredMessages, deleteMessage } = require("../models/Message");
const { getAllFileNames } = require("../models/File");

async function cleanupUnusedFiles() {
  try {
    const filesInDb = getAllFileNames();
    const filesInDirectory = await fs.readdir(config.FILE_PATH);
    const filesToDelete = filesInDirectory.filter((file) => !filesInDb.includes(file));
    for (const file of filesToDelete) {
      const filePath = path.join(config.FILE_PATH, file);
      await fs.unlink(filePath);
      console.log(`Deleted unused file: ${file}`);
    }
  } catch (error) { console.error("Error during cleanup of unused files:", error); }
}

// Run daily at 04:13 UTC+8 (20:13 UTC)
cron.schedule("13 20 * * *", async () => {
  console.log("Running daily cleanup for expired messages...");
  try {
    const expiredMessages = getExpiredMessages();
    for (const message of expiredMessages) {
      deleteMessage(message.id);
      console.log(`Deleted message with ID: ${message.id}`);
    }
    await cleanupUnusedFiles();
  } catch (error) { console.error("Error during cleanup of expired messages:", error); }
});
