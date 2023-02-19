const express = require("express");
const {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
  updatePassword,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/password-update", authMiddleware, updatePassword);
router.get("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

module.exports = router;
