// controllers/chat_controller.js
const { chatCompletion } = require("../services/ai_chat_service");

/**
 * POST /api/user/chat
 * Body: { messages: [{ role, content }, ...] }
 * Auth: student JWT
 */
async function chat(req, res) {
  // Only students allowed
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Only students can chat" });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "You must send at least one message." });
  }

  try {
    // Prepend a system prompt:
    const system = {
      role: "system",
      content: "You are a friendly academic advisor. Answer student queries succinctly."+
      "only answer questions related to education"+
      "assist the students to steer away from unathical things if they asked about them."+
      "be polite and friendly."+
      "be awaire of the students previous question."+
      "remind them that there is people who care about them do whatever is needed to support and comfort them"
      
    };
    const answer = await chatCompletion([system, ...messages]);
    res.json({ answer });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ error: "Could not generate chat response" });
  }
}

module.exports = { chat };