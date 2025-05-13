const bcrypt = require("bcrypt");
const { User, UniversityProfile } = require("../database/models");

// Create a university account (admin-only)
const createUniversity = async (req, res) => {
  const {
  
    username,
    email,
    password,
   
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Only admin can create a university
    const universityUser = await User.create({
     
      username,
      email,
      password_hash: hashedPassword,
      role: "university",
      approved: true, // automatically approved
    });

    res.status(201).json({
      message: "University account created",
      user: universityUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/admin/create-admin
 * (Admin-only) Create another administrator account
 */
async function createAdmin(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email, and password are required" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role: "admin",
      approved: true
    });

    res.status(201).json({
      message: "Admin account created",
      user: adminUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /api/admin/users/:userId/password
 * Change a user’s password (admin-only)
 */
async function updateUserPassword(req, res) {
  const userId = parseInt(req.params.userId, 10);
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const [updated] = await User.update(
      { password_hash: hash },
      { where: { id: userId } }
    );
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


 /* GET /api/admin/universities
 * List all university users
 */
async function listUniversities(req, res) {
  try {
    const universities = await User.findAll({
      where: { role: "university" },
      attributes: ["id", "username", "email", "approved", "createdAt"]
    });
    res.json({ universities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * GET /api/admin/students
 * List all student users
 */
async function listStudents(req, res) {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: ["id", "username", "email", "approved", "createdAt"]
    });
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * DELETE /api/admin/users/:userId
 * Delete a user by ID
 */
async function deleteUserById(req, res) {
  const userId = parseInt(req.params.userId, 10);
  try {
    const deleted = await User.destroy({ where: { id: userId } });
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PUT /api/admin/users/:userId/ban
 * Ban a user (set approved=false)
 */
async function banUser(req, res) {
  const userId = parseInt(req.params.userId, 10);
  try {
    const [updated] = await User.update({ approved: false }, { where: { id: userId } });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User banned" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PUT /api/admin/users/:userId/unban
 * Unban a user (set approved=true)
 */
async function unbanUser(req, res) {
  const userId = parseInt(req.params.userId, 10);
  try {
    const [updated] = await User.update({ approved: true }, { where: { id: userId } });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User unbanned" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * PUT /api/admin/change-password
 * (Admin) Change own password, requires old and new passwords.
 */
async function changeMyAdminPassword(req, res) {
  const adminId = req.user.id;
  const { old_password, new_password } = req.body;
  if (!old_password || !new_password) {
    return res.status(400).json({ error: "old_password and new_password are required" });
  }
  try {
    const user = await User.findByPk(adminId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const valid = await bcrypt.compare(old_password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(new_password, salt);
    await User.update({ password_hash: hash }, { where: { id: adminId } });
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createUniversity,
  createAdmin,
  updateUserPassword,
  listUniversities,
  listStudents,
  deleteUserById,
  banUser,
  unbanUser,
  changeMyAdminPassword
};