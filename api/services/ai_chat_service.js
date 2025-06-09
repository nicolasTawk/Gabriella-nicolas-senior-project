// services/ai_chat_service.js
require("dotenv").config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Send a chat conversation to OpenAI and return the assistant’s reply.
 * @param {Array<{ role: "user"|"assistant", content: string }>} messages
 */
async function chatCompletion(messages) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
  });
  return completion.choices[0].message.content;
}

module.exports = { chatCompletion };