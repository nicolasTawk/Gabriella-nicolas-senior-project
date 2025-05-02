const express = require("express");
const { createUniversity } = require("../controllers/admin_controller");
const { deleteUserByEmail, updateUserByEmail } = require("../controllers/user_managment");
const { body } = require("express-validator");
const { requireAdmin } = require("../middleware/auth_middleware");
const { uploadSchema, activateSchema } = require("../controllers/schema_admin_controller");

const router = express.Router();

// Admin endpoint to create a university account (unchanged)
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

// Admin endpoint to delete a user by email
router.delete("/user/email/:email", requireAdmin, deleteUserByEmail);

// Admin endpoint to update a user by email (only password and role can be updated)
router.put(
  "/user/email/:email",
  requireAdmin,
  [
    body("password").optional().isLength({ min: 5 }).withMessage("Password must be at least 5 characters if provided."),
    body("role").optional().isIn(["student", "university", "admin"]).withMessage("Invalid role."),
  ],
  updateUserByEmail
);

// ---- Questionnaire schema management ----

// Upload a new JSON-Schema (optionally activate immediately)
router.post(
  "/questionnaire/schema",
  requireAdmin,
  uploadSchema
);

// Flip the is_active flag to a stored version
router.put(
  "/questionnaire/schema/:version/activate",
  requireAdmin,
  activateSchema
);


module.exports = router;