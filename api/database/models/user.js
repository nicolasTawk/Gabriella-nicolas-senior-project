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

   

    /** Unique username students will use to log in */
    username: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
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
      type: DataTypes.ENUM("student", "university", "admin"),
      allowNull: false,
      defaultValue: "student",
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      // Students are auto-approved; university accounts must be created by an admin.
      defaultValue: true,
    },
  },
  {
    tableName: "User",
    timestamps: true,
  }
);

// Instance method to validate passwords
User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;