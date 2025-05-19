// routes/comment_routes.js
const router = require("express").Router();
const { body, param } = require("express-validator");
const { requireStudent, requireAuth } = require("../middleware/auth_middleware");  
const { postComment, listComments } = require("../controllers/comment_controller");
const { react, getReactionCounts } = require("../controllers/reaction_controller");

/**
 * POST /api/v1/reviews/:id/comments
 * — Add a comment under review :id (or reply if parent_id provided)
 * Front-end: send JSON { content: "<text>", parent_id?: <commentId> }
 */
router.post(
  "/reviews/:id/comments",
  requireStudent,
  [
    param("id").isInt().withMessage("Review ID must be integer"),
    body("content").notEmpty().withMessage("Content is required"),
    body("parent_id").optional().isInt().withMessage("Parent ID must be integer")
  ],
  postComment
);

/**
 * GET /api/v1/reviews/:id/comments
 * — List all comments (and replies) for review :id
 * Front-end: just fetch, no payload
 */
router.get(
  "/reviews/:id/comments",
  requireAuth,
  [ param("id").isInt().withMessage("Review ID must be integer") ],
  listComments
);

/**
 * POST /api/v1/comments/:id/reactions
 * — Like or dislike comment :id
 * Front-end: send JSON { type: "like" | "dislike" }
 *            toggles if same reaction exists, switches if different
 */
router.post(
  "/comments/:id/reactions",
  requireStudent,
  [
    param("id").isInt().withMessage("Comment ID must be integer"),
    body("type").isIn(["like","dislike"]).withMessage("Type must be 'like' or 'dislike'")
  ],
  react
);

router.get(
    "/comments/:id/reactions/count",
    requireStudent,
    getReactionCounts
  );

module.exports = router;