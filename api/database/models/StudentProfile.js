const { sequelize } = require("../db_connection");
const { DataTypes } = require("sequelize");
const User = require("./User");

const StudentProfile = sequelize.define(
  "StudentProfile",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: "User", key: "id" },
      onDelete: "CASCADE",
    },
    gender: { type: DataTypes.ENUM("male", "female", "other"), allowNull: true },
    birth_date: { type: DataTypes.DATEONLY, allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    parent_name: { type: DataTypes.STRING(120), allowNull: true },
    recent_school: { type: DataTypes.STRING(120), allowNull: true },
  },
  { tableName: "StudentProfile", timestamps: true }
);

User.hasOne(StudentProfile, { foreignKey: "user_id", as: "studentProfile" });
StudentProfile.belongsTo(User, { foreignKey: "user_id" });

module.exports = StudentProfile;
