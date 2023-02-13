const express = require("express");
const {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

module.exports = router;
