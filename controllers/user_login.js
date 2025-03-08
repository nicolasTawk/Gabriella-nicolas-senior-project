const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../database/models");
const { body, validationResult } = require("express-validator");

// ✅ Register a User
const registerUser = async (req, res) => {
  // CHANGE: Added input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { full_name, email, password, role } = req.body;

  try {
    // CHANGE: Added password hashing before creating the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({ message: "User registered!", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  // CHANGE: Added input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: "Invalid password" });

    // CHANGE: Added JWT token generation for login
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };