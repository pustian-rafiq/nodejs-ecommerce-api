const asyncHandler = require("express-async-handler");
const Product = require("../models/product");

const addProduct = asyncHandler(async (req, res) => {
  console.log(req.body);

  try {
    const productAdded = await Product.create(req.body);
    if (productAdded) {
      res.status(201).json({
        message: "Product added successfully",
        productAdded,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const productUpdated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (productUpdated) {
      res.status(201).json({
        message: "Product updated successfully",
        productUpdated,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});
const getProducts = asyncHandler(async (req, res) => {
  try {
    const allProduct = await Product.find();

    if (allProduct) {
      res.status(201).json({
        products: allProduct,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});
const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(201).json({
        product,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const productDeleted = await Product.findByIdAndDelete(req.params.id);

    if (productDeleted) {
      res.status(201).json({
        message: "Product deleted successfully",
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  addProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
};
