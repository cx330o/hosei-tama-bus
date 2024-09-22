const router = require("express").Router();
const { summarize, translate, describeImage } = require("../services/ai");
const messageService = require("../models/Message");
const { getCachedResult, getCachedImageResult, cacheResult } = require("../models/AiCache");

router.post("/summarize", async (req, res) => {
  const { messageId } = req.body;
  if (!messageId) return res.status(400).json({ error: "messageId is required" });

  const message = messageService.getMessage(messageId);
  if (!message.message_id) return res.status(404).json({ error: "Message not found" });
  if (!message.message_text) return res.status(400).json({ error: "Message has no text to summarize" });

  const cached = getCachedResult(messageId, "summarize");
  if (cached) return res.json({ data: { summary: cached } });

  const summary = await summarize(message.message_text);
  if (summary) cacheResult({ messageId, operation: "summarize", result: summary });
  res.json({ data: { summary } });
});

router.post("/translate", async (req, res) => {
  const { messageId, targetLang } = req.body;
  if (!messageId) return res.status(400).json({ error: "messageId is required" });

  const message = messageService.getMessage(messageId);
  if (!message.message_id) return res.status(404).json({ error: "Message not found" });
  if (!message.message_text) return res.status(400).json({ error: "Message has no text to translate" });

  const operation = `translate_${targetLang || "en"}`;
  const cached = getCachedResult(messageId, operation);
  if (cached) return res.json({ data: { translation: cached } });

  const translation = await translate(message.message_text, targetLang || "en");
  if (translation) cacheResult({ messageId, operation, result: translation });
  res.json({ data: { translation } });
});

router.post("/describe-image", async (req, res) => {
  const { fileName } = req.body;
  if (!fileName) return res.status(400).json({ error: "fileName is required" });

  const cached = getCachedImageResult(fileName, "describe");
  if (cached) return res.json({ data: { description: cached } });

  const imageUrl = `${req.protocol}://${req.get("host")}/api/files/${fileName}`;
  const description = await describeImage(imageUrl);
  if (description) cacheResult({ fileName, operation: "describe", result: description });
  res.json({ data: { description } });
});

module.exports = router;
