const express = require("express");
const { registerUser, loginUser } = require("../controllers/user_login");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// CHANGE: Added rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per windowMs
});

// Register route with validation
router.post(
  "/register",
  limiter, // CHANGE: Added rate limiter
  [
    body("email").isEmail().normalizeEmail(), // CHANGE: Added email validation
    body("password").isLength({ min: 5 }), // CHANGE: Added password validation
    body("full_name").not().isEmpty().trim().escape(), // CHANGE: Added name validation
  ],
  registerUser
);

// Login route with validation
router.post(
  "/login",
  limiter, // CHANGE: Added rate limiter
  [
    body("email").isEmail().normalizeEmail(), // CHANGE: Added email validation
    body("password").isLength({ min: 5 }), // CHANGE: Added password validation
  ],
  loginUser
);

module.exports = router;