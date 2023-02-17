const express = require("express");
const {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProducts,
} = require("../controllers/productController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, isAdmin, addProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);
router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
