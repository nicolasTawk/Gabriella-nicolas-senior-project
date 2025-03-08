const express = require("express");
require("dotenv").config();
const { connectDB } = require("./database/db_connection");
const { syncModels } = require("./database/models");
const routes = require("./router");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// CHANGE: Added CORS middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));

// CHANGE: Added Helmet for security headers
app.use(helmet());

// CHANGE: Added logging middleware
app.use(morgan("combined"));

app.use(express.json());

// CHANGE: Added API versioning
app.use("/api/v1", routes);

// CHANGE: Added error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await syncModels();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  // CHANGE: Uncomment for HTTPS
  // const https = require("https");
  // const fs = require("fs");
  // const options = {
  //   key: fs.readFileSync("key.pem"),
  //   cert: fs.readFileSync("cert.pem"),
  // };
  // https.createServer(options, app).listen(PORT, () => {
  //   console.log(`🚀 HTTPS Server running on port ${PORT}`);
  // });
};

startServer();