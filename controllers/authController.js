const {
  generateJWTToken,
  generateRefreshToken,
} = require("../config/jwtToken");
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
    const refreshToken = generateRefreshToken(user);
    updateRefreshToken = await User.findByIdAndUpdate(
      user.id,
      {
        refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    res.json({
      id: user.id,
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
