const bcrypt = require("bcrypt");
const { User } = require("../database/models");

// ✅ Register a User
const registerUser = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    const newUser = await User.create({
      full_name,
      email,
      password_hash: password, // Hashing handled in model
      role: role || "student",
    });

    res.status(201).json({ message: "User registered!", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: "Invalid password" });

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };