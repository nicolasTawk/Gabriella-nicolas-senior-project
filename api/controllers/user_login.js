const bcrypt = require("bcrypt");
const { User } = require("../database/models");
const { validationResult } = require("express-validator");
const { generateToken } = require("../middleware/auth_middleware");

// Register a User (self-registration) => only student
const registerUser = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { full_name, email, password, role } = req.body;

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Force all public registrations to "student"
    // This ensures that no one can self-register as a university or admin
    const finalRole = "student";

    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role: finalRole,
      approved: true, // auto-approved for student
    });

    // Generate a token for immediate login
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered as student!",
      user: newUser,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login a User (student, university, or admin)
const loginUser = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, loginAs } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If logging in as admin, ensure user is admin
    if (loginAs === "admin" && user.role !== "admin") {
      return res.status(403).json({ error: "This account is not an administrator account" });
    }

    // Validate password
    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };