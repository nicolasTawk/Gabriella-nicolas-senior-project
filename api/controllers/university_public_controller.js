// controllers/university_public_controller.js
const {
    UniversityProfile,
    Faculty,
    Major
  } = require("../database/models");
const { Op } = require("sequelize");
  
  /**
   * GET /api/universities
   * Public: list all universities (basic info)
   */
  async function listUniversities(req, res) {
    try {
      const profiles = await UniversityProfile.findAll({
        attributes: [
          "user_id",
          "name",
          "location",
          "website",
          "logo_data",
        ]
      });
      const universities = profiles.map((p) => {
        const u = p.toJSON();
        // embed the image as a base64 string
        if (u.logo_data) {
          u.logo_base64 = `data:image/png;base64,${u.logo_data.toString("base64")}`;
        }
        delete u.logo_data;
        return u;
      });
      res.json({ universities });
    } catch (err) {
      console.error(err);
      console.error('❌ Error in listUniversities:', err);

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

  /**
   * GET /api/universities/search
   * Public: list universities offering a given major name (partial match)
   * Query param: major
   */
  async function searchUniversitiesByMajor(req, res) {
    const { major } = req.query;
    if (!major) {
      return res.status(400).json({ error: "Query parameter 'major' is required" });
    }
    try {
      const universities = await UniversityProfile.findAll({
        attributes: ["user_id", "name", "location", "website"],
        include: [
          {
            model: Faculty,
            as: "faculties",
            include: [
              {
                model: Major,
                as: "majors",
                where: {
                  name: { [Op.substring]: major }
                },
                attributes: []
              }
            ],
            attributes: []
          }
        ],
        distinct: true
      });
      res.json({ universities });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
  
/**
 * GET /api/universities/:userId/majors
 * Public: list all majors for a university, each with its faculty name
 */
async function listMajorsByUniversity(req, res) {
  const userId = parseInt(req.params.userId, 10);
  try {
    // Find all majors whose faculty belongs to the given university
    const majors = await Major.findAll({
      include: [{
        model: Faculty,
        where: { university_profile_id: userId },
        attributes: ["name"]
      }],
      attributes: ["id", "name","number_of_credits","tuition_fee"]
    });
    // Map to desired output: { facultyName: ..., major: ... }
    const result = majors.map((m) => ({
      facultyName: m.Faculty.name,
      major: m.name,
      number_of_creadits : m.number_of_credits,
      tuition_fee : m.tuition_fee

    }));
    res.json({ majors: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listUniversities,
  getUniversityProfile,
  listUniversityFaculties,
  listFacultyMajors,
  searchUniversitiesByMajor,
  listMajorsByUniversity
};