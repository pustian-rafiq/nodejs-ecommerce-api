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

// @desc Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.status(200).json({ message: "User removed successfully" });
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(err);
  }
});

// @desc Update a user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      {
        new: true,
      }
    );
    if (userUpdated) {
      res.status(200).json(userUpdated);
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
