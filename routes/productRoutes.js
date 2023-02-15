const express = require("express");
const {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProducts,
} = require("../controllers/productController");

const router = express.Router();

router.post("/add", addProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
