const express = require("express");
const dotenv = require("dotenv").config();
const dbConnection = require("./config/dbConnect");
const morgan = require("morgan");

// import routes
const authRoutes = require("./routes/authRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorhandler");
dbConnection();
const app = express();

// use middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// define routes
app.use("/api/users", authRoutes);

// error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
