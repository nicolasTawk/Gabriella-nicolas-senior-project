// routes/review_routes.js
const router = require("express").Router();
const { body, param } = require("express-validator");
// requireStudent ensures only users with role === "student" may call these
const { requireStudent, requireAuth } = require("../middleware/auth_middleware");  
const {
  postReview,
  listReviews,
  updateReview,
  deleteReview
} = require("../controllers/review_controller");

/**
 * POST /api/v1/universities/:id/reviews
 * — Create a new review (1–5 stars + optional comment) on university :id
 * Front-end: send JSON { stars: <1–5>, comment: "<text>" } 
 *            with Bearer token
 */
router.post(
  "/universities/:id",
  requireStudent,
  [
    param("id").isInt().withMessage("University ID must be integer"),
    body("stars").isInt({ min: 1, max: 5 }).withMessage("Stars must be 1–5"),
    body("comment").optional().trim()
  ],
  postReview
);

/**
 * GET /api/v1/universities/:id/reviews
 * — List all reviews for university :id
 * Front-end: just fetch, no auth needed beyond student login
 */
router.get(
  "/universities/:id",
  requireAuth,
  listReviews
);

/**
 * PUT /api/v1/reviews/:id
 * — Update your own review :id
 * Front-end: send JSON { stars?, comment? }; student can only edit their own
 */
router.put(
  "/reviews/:id",
  requireStudent,
  [
    param("id").isInt().withMessage("Review ID must be integer"),
    body("stars").optional().isInt({ min: 1, max: 5 }),
    body("comment").optional().trim()
  ],
  updateReview
);

/**
 * DELETE /api/v1/reviews/:id
 * — Delete your own review :id
 * Front-end: no body required
 */
router.delete(
  "/reviews/:id",
  requireStudent,
  [ param("id").isInt().withMessage("Review ID must be integer") ],
  deleteReview
);

module.exports = router;