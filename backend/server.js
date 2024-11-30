// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Configure CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// MongoDB connection
const DB_URL = process.env.MONGO_URI;
mongoose
  .connect(DB_URL, { dbName: "AssignmentTwo" })
  .then(() => {
    console.log(`Connected to MongoDB at ${DB_URL}`);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Import routes
const userRoutes = require("./routers/user");
const employeeRoutes = require("./routers/employee");

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Routes middleware
app.use("/api/auth", userRoutes);
app.use("/api/employees", employeeRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Welcome to COMP3123 Assignment");
});

// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).send(`Route ${req.url} not found.`);
});

// Start the server
const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
