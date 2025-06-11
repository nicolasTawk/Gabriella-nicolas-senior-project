const { sequelize } = require("../db_connection");
const { DataTypes } = require("sequelize");
const User = require("./user");

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
  
    first_name: { 
      type: DataTypes.STRING(60), allowNull: false 
      },
  
      last_name:  { 
      type: DataTypes.STRING(60), allowNull: false 
      },
  },
  { tableName: "StudentProfile", timestamps: true }
);

User.hasOne(StudentProfile, { foreignKey: "user_id", as: "studentProfile" });
StudentProfile.belongsTo(User, { foreignKey: "user_id" });

module.exports = StudentProfile;
