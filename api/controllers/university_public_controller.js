// controllers/university_public_controller.js
const {
    UniversityProfile,
    Faculty,
    Major
  } = require("../database/models");
  
  /**
   * GET /api/universities
   * Public: list all universities (basic info)
   */
  async function listUniversities(req, res) {
    try {
      const universities = await UniversityProfile.findAll({
        attributes: [
          "user_id",
          "name",
          "location",
          "website",
         
        ]
      });
      res.json({ universities });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
  
  /**
   * GET /api/universities/:userId
   * Public: full profile of one university, including faculties & majors
   */
  async function getUniversityProfile(req, res) {
    const userId = parseInt(req.params.userId, 10);
    try {
      const profile = await UniversityProfile.findOne({
        where: { user_id: userId },
      });
      if (!profile) {
        return res.status(404).json({ error: "University not found" });
      }
      res.json({ profile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
  
  /**
   * GET /api/universities/:userId/faculties
   * Public: list just the faculties of one university
   */
  async function listUniversityFaculties(req, res) {
    const userId = parseInt(req.params.userId, 10);
    try {
      const faculties = await Faculty.findAll({
        where: { university_profile_id: userId }
      });
      res.json({ faculties });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
  
  /**
   * GET /api/faculties/:facultyId/majors
   * Public: list just the majors under one faculty
   */
  async function listFacultyMajors(req, res) {
    const facultyId = parseInt(req.params.facultyId, 10);
    try {
      const majors = await Major.findAll({
        where: { faculty_id: facultyId }
      });
      res.json({ majors });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
  
  module.exports = {
    listUniversities,
    getUniversityProfile,
    listUniversityFaculties,
    listFacultyMajors
  };