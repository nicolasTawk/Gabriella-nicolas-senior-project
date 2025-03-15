const express = require("express");
const { createUniversity, listPendingUniversities, approveUniversity } = require("../controllers/admin_controller");
const { body } = require("express-validator");
const { requireAdmin } = require("../middleware/auth_middleware");

const router = express.Router();

// Admin can create a university
router.post(
    "/create-university",
    requireAdmin,
    [
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 5 }),
      body("full_name").not().isEmpty().trim().escape(),
    ],
    createUniversity
  );
  
  module.exports = router;