const { DataTypes } = require("sequelize");
const { sequelize } = require("../db_connection");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures no duplicate emails
      validate: {
        isEmail: true, // Ensures valid email format
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("student", "university"),
      allowNull: false,
      defaultValue: "student", // Default role is student
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
    hooks: {
      beforeCreate: async (user) => {
        user.password_hash = await bcrypt.hash(user.password_hash, 10); // Hash password before saving
      },
    },
  }
);

module.exports = User;