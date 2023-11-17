const router = require("express").Router();
const upload = require("../utils/multerConfig");
const messageService = require("../models/Message");
const fileService = require("../models/File");
const { broadcastMessage } = require("../utils/websocketService");

router.get("/", (req, res) => {
  try {
    const { cursor, limit } = req.query;
    const result = messageService.getMessages({ cursor, limit: limit ? parseInt(limit, 10) : 20 });
    res.status(200).json({ data: result });
  } catch (error) { console.error(error.message); res.status(500).send("Internal Server Error"); }
});

router.get("/:messageId", (req, res) => {
  const messageId = req.params.messageId;
  try {
    const message = messageService.getMessage(messageId);
    res.status(200).json({ data: message });
  } catch (error) { console.error(error.message); res.status(500).send("Internal Server Error"); }
});

router.post("/", upload.array("files"), (req, res) => {
  const text = req.body.text ? req.body.text.trim() : null;
  const files = req.files;
  try {
    const messageId = messageService.createMessage(text);
    if (files && files.length > 0) files.forEach((file) => fileService.createFile(messageId, file));
    const message = messageService.getMessage(messageId);
    broadcastMessage({ type: "newMessage", message });
    res.status(200).json({ data: message });
  } catch (error) { console.error(error.message); res.status(500).send("Internal Server Error"); }
});

router.delete("/:id", (req, res) => {
  const messageId = req.params.id;
  try {
    messageService.deleteMessage(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) { console.error(error.message); res.status(500).send("Internal Server Error"); }
});

module.exports = router;
