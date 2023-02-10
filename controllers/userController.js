const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

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
  // req.user is the authenticated user.This user comes from the auth middleware
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findById(id);

    if (user) {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc Delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
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
  validateMongodbId(id);

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

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const userBlocked = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    if (userBlocked) {
      res.status(200).json({
        message: "User blocked successfully",
      });
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    throw new Error(err);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const userUnblocked = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    if (userUnblocked) {
      res.status(200).json({
        message: "User unblocked successfully",
      });
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
  blockUser,
  unblockUser,
};
