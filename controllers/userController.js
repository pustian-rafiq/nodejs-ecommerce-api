const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// @desc    Get all users
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json(users);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get a single user
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
  getUsers,
  getUser,
};
