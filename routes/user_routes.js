const express = require("express");
const { registerUser, loginUser } = require("../controllers/user_login");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiter to prevent brute-force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
});

// Public registration => only students
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

// Public login => any role can log in
router.post(
  "/login",
  limiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 5 }),
    // Optional field if you explicitly want to log in as admin
    body("loginAs").optional().isIn(["admin"]),
  ],
  loginUser
);

module.exports = router;