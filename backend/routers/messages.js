const router = require("express").Router();
const messageService = require("../models/Message");

router.get("/", (req, res) => {
  try {
    const { cursor, limit } = req.query;
    const result = messageService.getMessages({
      cursor,
      limit: limit ? parseInt(limit, 10) : 20,
    });
    res.status(200).json({ data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", (req, res) => {
  const text = req.body.text ? req.body.text.trim() : null;
  try {
    const messageId = messageService.createMessage(text);
    const message = messageService.getMessage(messageId);
    res.status(200).json({ data: message });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
