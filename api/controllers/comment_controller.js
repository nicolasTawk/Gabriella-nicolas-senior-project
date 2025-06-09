const { Comment, User } = require("../database/models");

/** POST /api/v1/reviews/:id/comments */
async function postComment(req, res) {
  const userId  = req.user.id;
  const revId   = +req.params.id;
  const { content, parent_id } = req.body;
  try {
    const comment = await Comment.create({
      user_id: userId,
      review_id: revId,
      parent_id: parent_id || null,
      content
    });
    res.status(201).json({ comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/v1/reviews/:id/comments */
async function listComments(req, res) {
  const revId = +req.params.id;
  try {
    const comments = await Comment.findAll({
      where: { review_id: revId },
      include: [{ model: User, attributes: ["id","username"] }],
      order: [["created_at","ASC"]]
    });
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { postComment, listComments };