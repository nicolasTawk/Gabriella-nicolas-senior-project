// routes/public_routes.js
const express = require("express");
const {
  listUniversities,
  getUniversityProfile,
  listUniversityFaculties,
  listFacultyMajors,
  searchUniversitiesByMajor,
  listMajorsByUniversity
} = require("../controllers/university_public_controller");
const { param, query } = require("express-validator");

const router = express.Router();

// 0. Search universities by major
router.get(
  "/universities/search",
  [query("major").notEmpty().withMessage("major query param is required")],
  searchUniversitiesByMajor
);

// 1. List all universities
router.get("/universities", listUniversities);

// 2. Full profile + faculties & majors
router.get(
  "/universities/:userId",
  [param("userId").isInt().withMessage("userId must be an integer")],
  getUniversityProfile
);

// 3. Faculties for one university
router.get(
  "/universities/:userId/faculties",
  [param("userId").isInt().withMessage("userId must be an integer")],
  listUniversityFaculties
);

// 5. Majors for a specific university
router.get(
  "/universities/:userId/majors",
  [param("userId").isInt().withMessage("userId must be an integer")],
  listMajorsByUniversity
);

// 4. Majors for one faculty
router.get(
  "/faculties/:facultyId/majors",
  [param("facultyId").isInt().withMessage("facultyId must be an integer")],
  listFacultyMajors
);

module.exports = router;