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
  
  /** Which questionnaire version produced these answers */
  schema_version: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  /** AI output – array of exactly three majors */
  recommended_majors: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  /** (Optional) the exact prompt we sent to OpenAI – great for audits */
  research_context: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = QuestionnaireResponse;
//truer