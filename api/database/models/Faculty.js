const { sequelize } = require("../db_connection");
const { DataTypes } = require("sequelize");
const UniversityProfile = require("./UniversityProfile");

/**
 * Faculty model: each faculty belongs to one UniversityProfile
 */
const Faculty = sequelize.define(
  "Faculty",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    university_profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "UniversityProfile", key: "user_id" },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Faculty",
    timestamps: true,
  }
);



module.exports = Faculty;