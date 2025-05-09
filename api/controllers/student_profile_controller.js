const bcrypt = require("bcrypt");
const { User, StudentProfile } = require("../database/models");

/* ------------------------------------------------------------------ */
/*  GET /students  – return User + StudentProfile                  */
/* ------------------------------------------------------------------ */
const getStudent = async (req, res) => {
  const  id  = req.user.id;

  // Students may access only themselves; admins & universities can fetch anyone
  if (req.user.role !== "student" ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const student = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] }, // never leak the hash
      include: [{ model: StudentProfile, as: "studentProfile" }],
    });
    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------------------------------------------------------ */
/*  PUT /students/:id  – update *any* User or StudentProfile column    */
/* ------------------------------------------------------------------ */
const updateStudent = async (req, res) => {
  const  id  = req.user.id;

  /* Split incoming body into user-table vs. profile-table updates */
  const USER_FIELDS    = [ "email"];
  const PROFILE_FIELDS = ["gender", "birth_date", "phone", "first_name", "last_name"];

  const userUpdates    = {};
  const profileUpdates = {};

  for (const [key, value] of Object.entries(req.body)) {
    if (USER_FIELDS.includes(key))    userUpdates[key]    = value;
    if (PROFILE_FIELDS.includes(key)) profileUpdates[key] = value;
  }

  // Handle password update if provided
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    userUpdates.password_hash = await bcrypt.hash(req.body.password, salt);
  }

  try {
    const student = await User.findByPk(id, {
      include: [{ model: StudentProfile, as: "studentProfile" }],
    });
    if (!student) return res.status(404).json({ error: "Student not found" });

    /* Core User columns (first name, username, …) */
    if (Object.keys(userUpdates).length) {
      await student.update(userUpdates);
    }

    /* Profile columns (gender, phone, …) */
    if (Object.keys(profileUpdates).length) {
      if (student.studentProfile) {
        await student.studentProfile.update(profileUpdates);
      } else {
        await StudentProfile.create({ user_id: student.id, ...profileUpdates });
      }
    }

    /* Fresh copy back to caller (without password hash) */
    const updated = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
      include: [{ model: StudentProfile, as: "studentProfile" }],
    });

    res.json({ message: "Student updated", student: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {updateStudent, getStudent};