const { Review, User } = require("../database/models");

/** POST /api/v1/universities/:id/reviews */
async function postReview(req, res) {
  const userId = req.user.id;
  const uniId  = +req.params.id;
  const { stars, comment } = req.body;
  try {
    const review = await Review.create({ user_id: userId, university_profile_id: uniId, stars, comment });
    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/v1/universities/:id/reviews */
async function listReviews(req, res) {
  const uniId = +req.params.id;
  try {
    const reviews = await Review.findAll({
      where: { university_profile_id: uniId },
      include: [{ model: User, attributes: ["id","username"] }]
    });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** PUT /api/v1/reviews/:id */
async function updateReview(req, res) {
  const revId = +req.params.id;
  const { stars, comment } = req.body;
  try {
    const [updated] = await Review.update(
      { stars, comment },
      { where: { id: revId, user_id: req.user.id } }
    );
    if (!updated) return res.status(404).json({ error: "Not found or not yours" });
    const review = await Review.findByPk(revId);
    res.json({ review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** DELETE /api/v1/reviews/:id */
async function deleteReview(req, res) {
  const revId = +req.params.id;
  try {
    const deleted = await Review.destroy({ where: { id: revId, user_id: req.user.id } });
    if (!deleted) return res.status(404).json({ error: "Not found or not yours" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { postReview, listReviews, updateReview, deleteReview };