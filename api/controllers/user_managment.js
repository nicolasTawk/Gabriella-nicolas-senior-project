const bcrypt = require("bcrypt");
const { User } = require("../database/models");

// ----- Self-Management Endpoints (for logged-in users) ----- //

// Update the currently logged-in user's profile: can change username and/or email.
async function updateProfileSelf(req, res) {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;
    
    // At least one field must be provided
    if (!username && !email) {
      return res.status(400).json({ error: "At least one field (username or email) must be provided." });
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    const [updated] = await User.update(updateData, { where: { id: userId } });
    if (updated) {
      const updatedUser = await User.findOne({ where: { id: userId } });
      return res.json({ message: "Account updated successfully.", user: updatedUser });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /api/user/me/password
 * Change own password: requires old_password and new_password
 */
async function changeMyPassword(req, res) {
  try {
    const userId = req.user.id;
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
      return res.status(400).json({ error: "old_password and new_password are required." });
    }
    const user = await User.findByPk(userId);
    const valid = await user.validPassword(old_password);
    if (!valid) {
      return res.status(401).json({ error: "Old password is incorrect." });
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);
    await User.update({ password_hash }, { where: { id: userId } });
    res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Delete the currently logged-in user (self-delete)
const deleteSelf = async (req, res) => {
  try {
    const userId = req.user.id; // Provided by requireAuth middleware
    const deleted = await User.destroy({ where: { id: userId } });
    if (deleted) {
      return res.json({ message: "Your account has been deleted successfully." });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ----- Admin Management Endpoints (update & delete by email) ----- //

// Delete a user by email (admin-only)
const deleteUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const deleted = await User.destroy({ where: { email } });
    if (deleted) {
      return res.json({ message: "User deleted successfully." });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a user by email (admin-only)
// The admin can only update the password and role.
// The email, full_name, and other fields remain unchanged.
const updateUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const { password, role } = req.body;
    const updateData = {};
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }
    if (role) {
      updateData.role = role;
    }
    
    if (!password && !role) {
      return res.status(400).json({ error: "At least one field (password or role) must be provided." });
    }
    
    const [updated] = await User.update(updateData, { where: { email } });
    if (updated) {
      const updatedUser = await User.findOne({ where: { email } });
      return res.json({ message: "User updated successfully.", user: updatedUser });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteSelf,
  updateProfileSelf,
  changeMyPassword
};