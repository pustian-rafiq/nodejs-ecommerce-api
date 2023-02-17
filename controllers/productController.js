const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const slugify = require("slugify");

const addProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
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
  const { id } = req.params;
  const findProduct = await Product.findById(id);

  console.log("findProduct", findProduct);
  if (findProduct) {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const productUpdated = await Product.findByIdAndUpdate(id, req.body, {
        upsert: true,
      });
      // Here upsert is true, if not, it will create a new record
      // new true means it will create a new record if it does not exist

      if (productUpdated) {
        res.status(201).json({
          message: "Product updated successfully",
          productUpdated,
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  } else {
    res.status(404).json({
      message: "Product not found",
    });
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
    const { id } = req.params;
    const findProduct = await Product.findById(id);
    if (findProduct) {
      const productDeleted = await Product.findByIdAndDelete(id);

      if (productDeleted) {
        res.status(201).json({
          message: "Product deleted successfully",
        });
      }
    } else {
      res.status(201).json({
        message: "Product not found",
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
