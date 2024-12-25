const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

// MongoDB connection URI
const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydatabase";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
