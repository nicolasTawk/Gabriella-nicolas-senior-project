// routes.js
const express = require("express");
const userRoutes = require("./routes/user_routes"); // Import user routes

const router = express.Router();

// Attach all route files here
router.use("/users", userRoutes); // Example: Mount user routes at /users

module.exports = router;