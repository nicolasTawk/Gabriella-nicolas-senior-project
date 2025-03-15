const express = require("express");
require("dotenv").config();
const { connectDB } = require("./database/db_connection");
const { syncModels } = require("./database/models");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoutes = require("./routes/user_routes");
const adminRoutes = require("./routes/admin_routes");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());

// Public endpoints (student registration & login)
app.use("/api/v1/users", userRoutes);

// Admin endpoints
app.use("/api/v1/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await syncModels();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();