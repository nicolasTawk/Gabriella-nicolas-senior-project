const { Favorite, UniversityProfile } = require("../database/models");

/**
 * POST /api/v1/favorites/:universityId
 * Add this university to the logged-in student’s favorites.
 */
async function addFavorite(req, res) {
  const userId = req.user.id;
  const uniId  = parseInt(req.params.universityId, 10);

  try {
    // 1. Verify the university exists
    const uni = await UniversityProfile.findOne({ where: { user_id: uniId } });
    if (!uni) {
      return res.status(404).json({ error: "University not found" });
    }

    // 2. Create or ignore if already in favorites
    const [fav, created] = await Favorite.findOrCreate({
      where: { user_id: userId, university_profile_id: uniId }
    });

    if (!created) {
      return res.status(200).json({ message: "Already in favorites" });
    }
    res.status(201).json({ favorite: fav });
  } catch (err) {
    console.error("addFavorite error:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/v1/favorites
 * List all universities the logged-in student has favorited.
 */
async function listFavorites(req, res) {
  const userId = req.user.id;

  try {
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [{
        model: UniversityProfile,
        attributes: ["user_id", "name", "location", "website"]
      }]
    });

    // flatten the output for front-end convenience
    const result = favorites.map(f => ({
      university: {
        id:       f.UniversityProfile.user_id,
        name:     f.UniversityProfile.name,
        location: f.UniversityProfile.location,
        website:  f.UniversityProfile.website
      },
      favorited_at: f.created_at
    }));

    res.json({ favorites: result });
  } catch (err) {
    console.error("listFavorites error:", err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * DELETE /api/v1/favorites/:universityId
 * Remove this university from the logged-in student’s favorites.
 */
async function removeFavorite(req, res) {
  const userId = req.user.id;
  const uniId  = parseInt(req.params.universityId, 10);

  try {
    const deleted = await Favorite.destroy({
      where: { user_id: userId, university_profile_id: uniId }
    });
    if (!deleted) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error("removeFavorite error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addFavorite, listFavorites, removeFavorite };