const { DataTypes } = require("sequelize");
const { sequelize } = require("../db_connection");

const QuestionnaireResponse = sequelize.define("QuestionnaireResponse", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "User", // Foreign key to Users table
      key: "id",
    },
  },
  answers_json: {
    type: DataTypes.JSON, // Stores all responses in JSON format no matter how many responses we choose to make!!
    allowNull: false,
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = QuestionnaireResponse;