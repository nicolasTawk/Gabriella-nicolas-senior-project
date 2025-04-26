const { sequelize } = require("../db_connection");
const User = require("./User");
const QuestionnaireResponse = require("./QuestionnaireResponse");

// Define relationships (if any)
User.hasMany(QuestionnaireResponse, { foreignKey: "user_id", onDelete: "CASCADE" });
QuestionnaireResponse.belongsTo(User, { foreignKey: "user_id" });

// Function to sync all models
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized.");
  } catch (error) {
    console.error("❌ Error syncing models:", error);
  }
};

module.exports = { syncModels ,User, QuestionnaireResponse };