require("dotenv").config({ path: "./config/.env" });
const { Sequelize } = require("sequelize");
// Load environment variables

// CHANGE: Added environment variable validation
//  const requiredEnvVars = ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT"];
//  for (const envVar of requiredEnvVars) {
//    if (!process.env[envVar]) {
//      console.error(`❌ Missing required environment variable: ${envVar}`);
//     process.exit(1);
//    }
//  }

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Database Successfully!");
    console.log("Database URL:", process.env.DB_URL ? "Is set" : "Not set");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };