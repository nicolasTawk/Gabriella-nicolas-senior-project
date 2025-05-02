const { sequelize } = require("../db_connection");
const { DataTypes } = require("sequelize");

/**
 * Each row stores ONE version of the questionnaire in JSON-Schema format.
 * Exactly ONE row at a time should have is_active = true.
 */
const QuestionnaireSchema = sequelize.define("QuestionnaireSchema", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  /** Human-readable tag, e.g. "2025-spring-v1" or "ABtest-Blue" */
  version: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  /** Full Draft-07 JSON-Schema object that defines all questions */
  schema_json: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  /** At most one row should be TRUE—used by the service layer */
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = QuestionnaireSchema;