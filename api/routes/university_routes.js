// routes/university_routes.js
const express = require("express");
const upload = require("../middleware/upload");
const { requireUniversity } = require("../middleware/auth_middleware");
const {
  createMyProfile,
  getMyUniversityProfile,
  updateMyProfile,
  deleteMyProfile,
  //updateMyPassword,
  createMyFaculty,
  updateMyFaculty,
  deleteMyFaculty,
  createMyMajor,
  updateMyMajor,
  deleteMyMajor,
  getMyFaculties,
  getMyMajors,
  getMyLogo
} = require("../controllers/university_profile_controller");
const { body, param } = require("express-validator");

const router = express.Router();
router.use(requireUniversity);

// Profile
router.post(
  "/Add-profile", upload.single("image"),
  [
    body("name").notEmpty().withMessage("Name is required").trim().escape(),
    body("website").optional().isURL(),
    body("about").optional().trim().escape(),
    body("phone").optional().trim().escape(),
    body("established_date").optional().isISO8601(),
    body("location").optional().trim().escape(),
    body("contact_email").optional().isEmail().normalizeEmail(),
    body("accreditation").optional().trim().escape(),
  ],
  createMyProfile
);
router.get("/get-profile", getMyUniversityProfile);
router.put(
  "/Update-profile", upload.single("image"),
  [
    body("name").optional().trim().escape(),
    body("website").optional().isURL(),
    body("about").optional().trim().escape(),
    body("phone").optional().trim().escape(),
    body("established_date").optional().isISO8601(),
    body("location").optional().trim().escape(),
    body("contact_email").optional().isEmail().normalizeEmail(),
    body("accreditation").optional().trim().escape(),

  ],
  updateMyProfile
);

router.delete("/Delete-profile", deleteMyProfile);

// Serve uploaded logo image
router.get(
  "/profile/logo",
  getMyLogo
);

// // Password
// router.put(
//   "/Change-password",
//   [body("password").isLength({ min: 5 }).withMessage("Password too short")],
//   updateMyPassword
// );

// Faculties
router.post(
  "/profile/Add-faculties",
  [body("name").notEmpty().withMessage("Faculty name required").trim().escape()],
  createMyFaculty
);
router.put(
  "/profile/Update-faculties/:facultyId",
  [
    param("facultyId").isInt(),
    body("name").optional().trim().escape(),
    body("description").optional().trim().escape(),
  ],
  updateMyFaculty
);
router.delete(
  "/profile/Delete-faculties/:facultyId",
  [param("facultyId").isInt()],
  deleteMyFaculty
);

// Majors
router.post(
  "/faculties/Add-major/:facultyId",
  [
    param("facultyId").isInt(),
    body("name").notEmpty().withMessage("Major name required").trim().escape(),
    body("code").notEmpty().withMessage("code is requiered").trim().escape(),
    body("description").optional().trim().escape(),
  ],
  createMyMajor
);
router.put(
  "/faculties/Update-major/:facultyId/:majorId",
  [
    param("facultyId").isInt(),
    param("majorId").isInt(),
    body("name").optional().trim().escape(),
    body("code").optional().trim().escape(),
    body("description").optional().trim().escape(),
  ],
  updateMyMajor
);
router.delete(
  "/faculties/:facultyId/majors/:majorId",
  [param("facultyId").isInt(), param("majorId").isInt()],
  deleteMyMajor
);

router.get("/faculties", getMyFaculties);
router.get("/faculties/:facultyId/majors", getMyMajors);

module.exports = router;