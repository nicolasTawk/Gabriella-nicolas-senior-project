const { Reaction } = require("../database/models");

/** POST /api/v1/comments/:id/reactions */
async function react(req, res) {
  const userId = req.user.id;
  const comId  = +req.params.id;
  const { type } = req.body; // 'like' or 'dislike'
  try {
    const existing = await Reaction.findOne({ where: { user_id: userId, comment_id: comId } });
    if (existing) {
      if (existing.type === type) {
        await existing.destroy();
        return res.json({ message: "Reaction removed" });
      }
      existing.type = type;
      await existing.save();
      return res.json({ message: "Reaction updated" });
    }
    await Reaction.create({ user_id: userId, comment_id: comId, type });
    res.status(201).json({ message: "Reacted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/v1/comments/:id/reactions/count
 * Returns the total likes and dislikes for comment :id
 */
async function getReactionCounts(req, res) {
  const comId = +req.params.id;
  try {
    const likes = await Reaction.count({
      where: { comment_id: comId, type: "like" }
    });
    const dislikes = await Reaction.count({
      where: { comment_id: comId, type: "dislike" }
    });
    res.json({ comment_id: comId, likes, dislikes });
  } catch (err) {
    console.error("getReactionCounts error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  react,
  getReactionCounts
};