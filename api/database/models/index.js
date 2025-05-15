const { sequelize } = require("../db_connection");
const User = require("./User");
const QuestionnaireResponse = require("./QuestionnaireResponse");
const QuestionnaireSchema = require("./QuestionnaireSchema");
const StudentProfile = require("./StudentProfile");
const Faculty = require('./Faculty');
const Major = require('./Major');
const UniversityProfile = require("./UniversityProfile");
const Review = require("./Review");
const Comment = require("./Comment");
const Reaction = require("./Reaction");
const Favorite = require("./Favorite");

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


// Reviews: users review universities
User.hasMany(Review, { foreignKey: "user_id", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "user_id" });
UniversityProfile.hasMany(Review, { foreignKey: "university_profile_id", onDelete: "CASCADE" });
Review.belongsTo(UniversityProfile, { foreignKey: "university_profile_id" });

// Comments: threaded under reviews and by users
Review.hasMany(Comment, { foreignKey: "review_id", as: "comments", onDelete: "CASCADE" });
Comment.belongsTo(Review, { foreignKey: "review_id" });
User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "user_id" });
Comment.hasMany(Comment, { foreignKey: "parent_id", as: "replies", onDelete: "CASCADE" });
Comment.belongsTo(Comment, { foreignKey: "parent_id", as: "parent" });

// Reactions: like/dislike on comments
Comment.hasMany(Reaction, { foreignKey: "comment_id", as: "reactions", onDelete: "CASCADE" });
Reaction.belongsTo(Comment, { foreignKey: "comment_id" });
User.hasMany(Reaction, { foreignKey: "user_id", onDelete: "CASCADE" });
Reaction.belongsTo(User, { foreignKey: "user_id" });

// Favorites: students mark universities
User.hasMany(Favorite, { foreignKey: "user_id", onDelete: "CASCADE" });
Favorite.belongsTo(User, { foreignKey: "user_id" });
UniversityProfile.hasMany(Favorite, { foreignKey: "university_profile_id", onDelete: "CASCADE" });
Favorite.belongsTo(UniversityProfile, { foreignKey: "university_profile_id" });


// Function to sync all models
const syncModels = async () => {
  try {
    await sequelize.sync();
    console.log("✅ Models synchronized.");
  } catch (error) {
    console.error("❌ Error syncing models:", error);
  }
};

module.exports = {
  syncModels,
  User,
  QuestionnaireResponse,
  QuestionnaireSchema,
  StudentProfile,
  UniversityProfile,
  Faculty,
  Major,
  Favorite,
  Review,
  Comment,
  Reaction
};