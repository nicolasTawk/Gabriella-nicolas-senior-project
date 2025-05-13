const { sequelize } = require("../db_connection");
const User = require("./User");
const QuestionnaireResponse = require("./QuestionnaireResponse");
const QuestionnaireSchema = require("./QuestionnaireSchema");
const StudentProfile = require("./StudentProfile");
const Faculty = require('./Faculty');
const Major = require('./Major');
const UniversityProfile = require("./UniversityProfile");

// Define relationships (if any)
User.hasMany(QuestionnaireResponse, { foreignKey: "user_id", onDelete: "CASCADE" });
QuestionnaireResponse.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(UniversityProfile, { foreignKey: "user_id", as: "universityProfile" });
UniversityProfile.belongsTo(User, { foreignKey: "user_id" });

// Faculty & Major associations
UniversityProfile.hasMany(Faculty, { foreignKey: "university_profile_id", as: "faculties" });
Faculty.belongsTo(UniversityProfile, { foreignKey: "university_profile_id" });

Faculty.hasMany(Major, { foreignKey: "faculty_id", as: "majors" });
Major.belongsTo(Faculty, { foreignKey: "faculty_id" });


// Function to sync all models
const syncModels = async () => {
  try {
    await sequelize.sync();
    console.log("✅ Models synchronized.");
  } catch (error) {
    console.error("❌ Error syncing models:", error);
  }
};

module.exports = { syncModels, User, QuestionnaireResponse, QuestionnaireSchema, StudentProfile, UniversityProfile, Faculty, Major };