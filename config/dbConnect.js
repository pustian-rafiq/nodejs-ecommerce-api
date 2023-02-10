const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    const connect = mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }
};

module.exports = dbConnect;
