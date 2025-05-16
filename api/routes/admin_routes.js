const express = require("express");
const {
  createUniversity,
  createAdmin,
  listUniversities,
  listStudents,
  updateUserPassword,
  deleteUserById,
  banUser,
  unbanUser,
  changeMyAdminPassword
} = require("../controllers/admin_controller");
const { body, param } = require("express-validator");
const { requireAdmin } = require("../middleware/auth_middleware");
const { uploadSchema, activateSchema } = require("../controllers/schema_admin_controller");

const router = express.Router();

// Admin endpoint to create a university account (unchanged)
router.post(
  "/create-university",
  requireAdmin,
  [
    body("username").isLength({min :5}),
    body("password").isLength({ min: 5 }),
    body("email").isEmail(),
  ],
  createUniversity
);

// Admin endpoint to create another admin account
router.post(
  "/create-admin",
  requireAdmin,
  [
    body("username").isLength({ min: 5 }).withMessage("username must be at least 5 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters")
  ],
  createAdmin
);

// ----- User management for admin ----- 

// List all university users
router.get(
  "/universities",
  requireAdmin,
  listUniversities
);

// List all student users
router.get(
  "/students",
  requireAdmin,
  listStudents
);

// Change a user's password
router.put(
  "/users/:userId/password",
  requireAdmin,
  [
    param("userId").isInt().withMessage("userId must be an integer"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters")
  ],
  updateUserPassword
);

// Delete a user by ID
router.delete(
  "/users/:userId",
  requireAdmin,
  [param("userId").isInt().withMessage("userId must be an integer")],
  deleteUserById
);

// Ban a user
router.put(
  "/users/:userId/ban",
  requireAdmin,
  [param("userId").isInt().withMessage("userId must be an integer")],
  banUser
);

// Unban a user
router.put(
  "/users/:userId/unban",
  requireAdmin,
  [param("userId").isInt().withMessage("userId must be an integer")],
  unbanUser
);

// Admin: change own password (requires old and new)
router.put(
  "/change-password",
  requireAdmin,
  [
    body("old_password").notEmpty().withMessage("Old password is required"),
    body("new_password").isLength({ min: 5 }).withMessage("New password must be at least 5 characters")
  ],
  changeMyAdminPassword
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