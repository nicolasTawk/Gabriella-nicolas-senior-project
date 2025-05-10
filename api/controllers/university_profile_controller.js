// controllers/university_profile_controller.js
const bcrypt = require("bcrypt");
const {
  User,
  UniversityProfile,
  Faculty,
  Major,
} = require("../database/models");
const { validationResult } = require("express-validator");

/**
 * POST /api/university/profile
 */
async function createMyProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.user.id;
  // Prevent duplicate
  const existing = await UniversityProfile.findOne({ where: { user_id: userId } });
  if (existing) return res.status(400).json({ error: "Profile already exists" });

  const {
    name,
    website,
    about,
    phone,
    established_date,
    location,
    contact_email,
    accreditation,
 
  } = req.body;

  // Multer put the file here in RAM
 const logoBuffer = req.file?.buffer;

  try {
    const profile = await UniversityProfile.create({
      user_id: userId,
      name,
      website,
      about,
      phone,
      established_date,
      location,
      contact_email,
      accreditation,
      logo_data: logoBuffer,
   
    });
    res.status(201).json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/university/profile
 
 */
async function getMyUniversityProfile(req, res) {
  const userId = req.user.id;
  try {
    const profile = await UniversityProfile.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Faculty,
          as: "faculties",
          include: [{ model: Major, as: "majors" }],
        },
      ],
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PUT /api/university/profile
 * (University) Update your profile fields
 */
async function updateMyProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.user.id;
  try {
    const profile = await UniversityProfile.findOne({ where: { user_id: userId } });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    // Build updates object
    const updates = { ...req.body };
    // If a new image was uploaded, store its buffer
    if (req.file?.buffer) {
      updates.logo_data = req.file.buffer;
    }

    await profile.update(updates);
    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * DELETE /api/university/profile
 * (University) Remove your profile
 */
async function deleteMyProfile(req, res) {
  const userId = req.user.id;
  try {
    const deleted = await UniversityProfile.destroy({ where: { user_id: userId } });
    if (!deleted) return res.status(404).json({ error: "Profile not found" });
    res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PUT /api/university/password
 * (University) Change your own password
 */
async function updateMyPassword(req, res) {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password is required" });

  const userId = req.user.id;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const [updated] = await User.update(
      { password_hash: hash },
      { where: { id: userId, role: "university" } }
    );
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/university/faculties
 * (University) Add a new faculty
 */
async function createMyFaculty(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.user.id;
  const { name, description } = req.body;
  try {
    const faculty = await Faculty.create({
      university_profile_id: userId,
      name,
      description,
    });
    res.status(201).json({ faculty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PUT /api/university/faculties/:facultyId
 * (University) Update one of your faculties
 */
async function updateMyFaculty(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.user.id;
  const facultyId = parseInt(req.params.facultyId, 10);
  try {
    const faculty = await Faculty.findOne({
      where: { id: facultyId, university_profile_id: userId },
    });
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });
    await faculty.update(req.body);
    res.json({ faculty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * DELETE /api/university/faculties/:facultyId
 * (University) Remove one of your faculties
 */
async function deleteMyFaculty(req, res) {
  const userId = req.user.id;
  const facultyId = parseInt(req.params.facultyId, 10);
  try {
    const deleted = await Faculty.destroy({
      where: { id: facultyId, university_profile_id: userId },
    });
    if (!deleted) return res.status(404).json({ error: "Faculty not found" });
    res.json({ message: "Faculty deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * POST /api/university/faculties/:facultyId/majors
 * (University) Add a major to one of your faculties
 */
async function createMyMajor(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.user.id;
  const facultyId = parseInt(req.params.facultyId, 10);
  const { name, code, description } = req.body;
  try {
    const faculty = await Faculty.findOne({
      where: { id: facultyId, university_profile_id: userId },
    });
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });
    const major = await Major.create({ faculty_id: facultyId, name, code, description });
    res.status(201).json({ major });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PUT /api/university/faculties/:facultyId/majors/:majorId
 * (University) Update a major in your faculty
 */
async function updateMyMajor(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const userId = req.user.id;
  const facultyId = parseInt(req.params.facultyId, 10);
  const majorId = parseInt(req.params.majorId, 10);
  try {
    // ensure faculty belongs to this user
    const faculty = await Faculty.findOne({
      where: { id: facultyId, university_profile_id: userId },
    });
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    const major = await Major.findOne({
      where: { id: majorId, faculty_id: facultyId },
    });
    if (!major) return res.status(404).json({ error: "Major not found" });

    await major.update(req.body);
    res.json({ major });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * DELETE /api/university/faculties/:facultyId/majors/:majorId
 * (University) Remove a major from your faculty
 */
async function deleteMyMajor(req, res) {
  const userId = req.user.id;
  const facultyId = parseInt(req.params.facultyId, 10);
  const majorId = parseInt(req.params.majorId, 10);
  try {
    // ensure faculty belongs to this user
    const faculty = await Faculty.findOne({
      where: { id: facultyId, university_profile_id: userId },
    });
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    const deleted = await Major.destroy({
      where: { id: majorId, faculty_id: facultyId },
    });
    if (!deleted) return res.status(404).json({ error: "Major not found" });

    res.json({ message: "Major deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/university/faculties
 * (University) List all faculties of the logged-in university
 */
async function getMyFaculties(req, res) {
  const userId = req.user.id;
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
 * GET /api/university/faculties/:facultyId/majors
 * (University) List all majors under one of your faculties
 */
async function getMyMajors(req, res) {
  const userId = req.user.id;
  const facultyId = parseInt(req.params.facultyId, 10);
  try {
    // Ensure this faculty belongs to the university
    const faculty = await Faculty.findOne({
      where: { id: facultyId, university_profile_id: userId }
    });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    const majors = await Major.findAll({ where: { faculty_id: facultyId } });
    res.json({ majors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/university/profile/logo
 * (University) Fetch the uploaded logo image as binary
 */
async function getMyLogo(req, res) {
  try {
    const userId = req.user.id;
    const profile = await UniversityProfile.findOne({
      where: { user_id: userId },
      attributes: ["logo_data"],
    });
    if (!profile || !profile.logo_data) {
      return res.status(404).json({ error: "Logo not found" });
    }
    res.set("Content-Type", "image/png");
    res.send(profile.logo_data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createMyProfile,
  getMyUniversityProfile,
  updateMyProfile,
  deleteMyProfile,
  updateMyPassword,
  createMyFaculty,
  updateMyFaculty,
  deleteMyFaculty,
  createMyMajor,
  updateMyMajor,
  deleteMyMajor,
  getMyFaculties,
  getMyMajors,
  getMyLogo,
};