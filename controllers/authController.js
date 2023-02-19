const {
  generateJWTToken,
  generateRefreshToken,
} = require("../config/jwtToken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validateMongodbId = require("../utils/validateMongodbId");

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

// Refresh token
const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken) {
    throw new Error("No refresh token found in cookies");
  }
  const user = await User.findOne({ refreshToken });

  if (!user) throw new Error("No refresh token found in cookies");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    console.log(refreshToken, user);
    if (err || user?.id !== decoded?.id)
      throw new Error("Invalid refresh token");
    const access_token = generateJWTToken(user);
    res.json({
      access_token,
    });
  });
});

// Logout a user
const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new Error("No refresh token found in cookies");
  const user = await User.findOne({ refreshToken });
  console.log("fddddf", refreshToken, user);
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      message: "Logout successful",
    }); //Forbiden
  }

  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({
    message: "Logout successful",
  }); //Forbiden
});
// Update password
const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const password = req.body.password;
  validateMongodbId(id);

  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.status(200).json(updatedPassword);
  } else {
    res.status(400).json({
      error: "Password cannot be empty",
    });
  }
});

module.exports = {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
  updatePassword,
};
