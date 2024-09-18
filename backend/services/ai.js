const Groq = require("groq-sdk");
const config = require("../utils/config");

const groq = new Groq({ apiKey: config.GROQ_API_KEY });

async function summarize(text) {
  const plainText = text.replace(/<[^>]*>/g, "").trim();
  if (!plainText) return null;

  const response = await groq.chat.completions.create({
    model: config.AI_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant. Summarize the following text in 1-2 concise sentences. Reply in the same language as the input text.",
      },
      { role: "user", content: plainText },
    ],
    max_tokens: 200,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || null;
}

async function translate(text, targetLang = "en") {
  const plainText = text.replace(/<[^>]*>/g, "").trim();
  if (!plainText) return null;

  const response = await groq.chat.completions.create({
    model: config.AI_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a translator. Translate the following text to ${targetLang}. Only output the translation, nothing else.`,
      },
      { role: "user", content: plainText },
    ],
    max_tokens: 500,
    temperature: 0.2,
  });

  return response.choices[0]?.message?.content || null;
}

async function describeImage(imageUrl) {
  const response = await groq.chat.completions.create({
    model: "llama-3.2-90b-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe this image in 1-2 concise sentences. Be specific about what you see.",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 200,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || null;
}

module.exports = { summarize, translate, describeImage };
