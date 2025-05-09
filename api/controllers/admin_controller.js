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

module.exports = { createUniversity };