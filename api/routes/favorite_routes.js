const router = require("express").Router();
const { param } = require("express-validator");
const { requireStudent } = require("../middleware/auth_middleware");
const {
  addFavorite,
  listFavorites,
  removeFavorite
} = require("../controllers/favorite_controller");

/**
 * POST /api/v1/favorites/:universityId
 * Add a university to the student’s favorites.
 * Body: none
 */
router.post(
  "/favorites/:universityId",
  requireStudent,
  [ param("universityId").isInt().withMessage("Must be a valid university ID") ],
  addFavorite
);

/**
 * GET /api/v1/favorites
 * List all favorited universities for the student.
 */
router.get(
  "/favorites",
  requireStudent,
  listFavorites
);

/**
 * DELETE /api/v1/favorites/:universityId
 * Remove a university from the student’s favorites.
 */
router.delete(
  "/favorites/:universityId",
  requireStudent,
  [ param("universityId").isInt().withMessage("Must be a valid university ID") ],
  removeFavorite
);

module.exports = router;