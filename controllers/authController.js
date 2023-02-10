const { generateJWTToken } = require("../config/jwtToken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Register a new user
const registerController = asyncHandler(async (req, res) => {
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

// Login a user
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateJWTToken(user),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

module.exports = { registerController, loginController };
