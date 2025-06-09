const express = require("express");
const { registerUser, loginUser } = require("../controllers/user_login");
const { updateProfileSelf, changeMyPassword, deleteSelf } = require("../controllers/user_managment");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
// Questionnaire AI workflow
const { submitQuestionnaire } = require("../controllers/questionnaire_controller");
const {validateQuestionnaire }  = require("../middleware/validate_questionnaire");
const { chat } = require("../controllers/chat_controller");
const { getActiveSchema, }     = require("../services/questionnaire_schema_service");
const { requireAuth, requireStudent, requireUniversity } = require("../middleware/auth_middleware");
const { getStudent, updateStudent } = require("../controllers/student_profile_controller");
const {getSchema} = require("../controllers/schema_admin_controller");

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
    body("username").trim().isLength({ min: 3, max: 40 }).withMessage("Username must be 3-40 characters long."),   
    body("first_name").not().isEmpty().trim().escape(),
    body("last_name").not().isEmpty().trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 5 }).withMessage("password must be at least 5 characters long"),// must be 8 characters must contain capital and spetian 

   
  ],
  registerUser
);

// Public login route (for student, university, and admin login)
router.post(
  "/login",
  limiter,
  [
    body("username").trim(),   
    body("password"),

    // Optional field for explicit admin login
    body("loginAs").optional().isIn(["admin"]),
  ],
  loginUser
);

// Public: get active questionnaire schema
router.get("/questionnaire/schema", async (_req, res) => {
  try {
    const { version, schema } = await getActiveSchema();
    res.json({ version, schema });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No active questionnaire schema" });
  }
});

// Student: submit questionnaire answers and receive AI major recommendations
router.post(
  "/questionnaire/submit",
  requireAuth,
  validateQuestionnaire,
  submitQuestionnaire
);

router.get("/questionnaire/schema/:version?", getSchema);


// Protected: update own username/email
router.put(
  "/me/update",
  requireAuth,
  [
    body("username").optional().trim().isLength({ min: 3, max: 40 }).withMessage("Username must be 3-40 characters."),
    body("email").optional().isEmail().normalizeEmail()
  ],
  updateProfileSelf
);

// Protected: change own password
router.put(
  "/me/change-password",
  requireAuth,
  [
    body("old_password").notEmpty().withMessage("Old password is required."),
    body("new_password").isLength({ min: 5 }).withMessage("New password must be at least 5 characters.")
  ],
  changeMyPassword
);

// Protected route for deleting your own account
router.delete("/me/delete", requireAuth, deleteSelf);

// ─── STUDENT INFO & FULL UPDATE ──────────────────────────────────────
router.get("/students/profile", requireAuth, requireStudent, getStudent);

router.put(
  "/students/updade_profile",
  requireStudent,requireAuth,
  [
    // optional express-validator checks
    body("first_name").optional().trim().escape(),
    body("last_name").optional().trim().escape(),
    body("email").optional().isEmail().normalizeEmail(),
    // add checks for profile fields if you like
  ],
   updateStudent
);

// Student: free-form AI chat
router.post(
    "/chat",
    requireAuth,
    // expects { messages: [{ role, content }, …] }
    chat
  );





module.exports = router;