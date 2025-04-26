const express = require("express");
const { registerUser, loginUser } = require("../controllers/user_login");
const { updateSelf, deleteSelf } = require("../controllers/user_managment");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { requireAuth } = require("../middleware/auth_middleware");

const router = express.Router();

// Rate limiter to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
});

// Public registration route (only creates student accounts)
router.post(
  "/register",
  limiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 5 }),
    body("full_name").not().isEmpty().trim().escape(),
  ],
  registerUser
);

// Public login route (for student, university, and admin login)
router.post(
  "/login",
  limiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 5 }),
    // Optional field for explicit admin login
    body("loginAs").optional().isIn(["admin"]),
  ],
  loginUser
);

// Protected route for updating your own account (user can change full_name and/or password)
router.put(
  "/me/update",
  requireAuth,
  [
    body("full_name").optional().trim().escape(),
    body("password").optional().isLength({ min: 5 }).withMessage("Password must be at least 5 characters if provided."),
  ],
  updateSelf
);

// Protected route for deleting your own account
router.delete("/me/delete", requireAuth, deleteSelf);

module.exports = router;