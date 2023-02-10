const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Register a new user
const register = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    // return res.status(400).json({ error: "User already exists" });
    throw new Error("User already exists");
  }
});

module.exports = { register };
