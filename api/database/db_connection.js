require("dotenv").config({ path: "./config/.env" });
const { Sequelize } = require("sequelize");
// Load environment variables

// CHANGE: Added environment variable validation
 const requiredEnvVars = ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT"];
 for (const envVar of requiredEnvVars) {
   if (!process.env[envVar]) {
     console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
   }
 }

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false, // Set to true for debugging
    // CHANGE: Added connection pooling
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Database Successfully!");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };