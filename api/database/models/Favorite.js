const { DataTypes } = require("sequelize");
const { sequelize } = require("../db_connection");

const Favorite = sequelize.define("Favorite", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "User", key: "id" }
  },
  university_profile_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "UniversityProfile", key: "user_id" }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "Favorite",
  timestamps: false,
  // enforce one favorite per student per university
  indexes: [
    {
      unique: true,
      fields: ["user_id", "university_profile_id"]
    }
  ]
});

module.exports = Favorite;