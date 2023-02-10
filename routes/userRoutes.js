const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
} = require("../controllers/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getUsers);
// router.get("/:id", getUser);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.put("/:id", updateUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
