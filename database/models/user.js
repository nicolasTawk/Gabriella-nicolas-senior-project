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
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("student", "university"),
      allowNull: false,
      defaultValue: "student",
    },
  },
  {
    tableName: "User", // Explicitly define table name
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      },
    },
  }
);
module.exports = User;