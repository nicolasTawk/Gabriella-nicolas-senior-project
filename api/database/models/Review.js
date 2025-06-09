const { DataTypes } = require("sequelize");
const { sequelize } = require("../db_connection");

const Review = sequelize.define("Review", {
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:      { 
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: "User", key: "id" }
  },
  university_profile_id: { 
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: "UniversityProfile", key: "user_id" }
  },
  stars:        { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment:      { type: DataTypes.TEXT, allowNull: true },
  created_at:   { type: DataTypes.DATE,  defaultValue: DataTypes.NOW }
}, {
  tableName: "Review",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["user_id", "university_profile_id"]
    }
  ]
});

module.exports = Review;