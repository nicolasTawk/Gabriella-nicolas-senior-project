const { sequelize } = require("../db_connection");
const { DataTypes } = require("sequelize");
const User = require("./User");  // ensure User is imported first

/**
 * University-specific data, linked 1-to-1 with a User whose role="university"
 */
const UniversityProfile = sequelize.define(
  "UniversityProfile",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: "User", key: "id" },
      onDelete: "CASCADE",
    },

    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isUrl: true },
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    established_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    accreditation: {
      type: DataTypes.STRING(200),
      allowNull: true,

    },
},


  {
    tableName: "UniversityProfile",
    timestamps: true,
  }
);



module.exports = UniversityProfile;