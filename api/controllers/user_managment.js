const bcrypt = require("bcrypt");
const { User } = require("../database/models");

// ----- Self-Management Endpoints (for logged-in users) ----- //

// Update the currently logged-in user: can change full_name and/or password.
const updateSelf = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, password } = req.body;
    
    // At least one field must be provided
    if (!full_name && !password) {
      return res.status(400).json({ error: "At least one field (full_name or password) must be provided." });
    }
    
    const updateData = {};
    if (full_name) updateData.full_name = full_name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }
    
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
};

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

module.exports = { deleteSelf, updateSelf, deleteUserByEmail, updateUserByEmail };