const { sequelize } = require("../db_connection");
const { DataTypes } = require("sequelize");
const Faculty = require("./Faculty");

/**
 * Major model: each major belongs to one Faculty
 */
const Major = sequelize.define(
  "Major",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    faculty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Faculty", key: "id" },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tuition_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: "Yearly tuition fee for this major",
    },
  },
  {
    tableName: "Major",
    timestamps: true,
  }
);


module.exports = Major;