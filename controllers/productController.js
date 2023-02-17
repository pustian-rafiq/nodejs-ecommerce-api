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
    // Product filtering Way-1
    // const allProduct = await Product.find(req.query);

    // Product filtering Way-2
    // const allProduct = await Product.find({
    //   brand: req.query.brand,
    // });

    // Product filtering Way-3
    // const allProduct = await Product.where("brand").equals(req.query.brand);

    // Filtering product
    const queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    console.log(queryObj, req.query);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    // Sorting
    // let query = JSON.parse(queryString);
    let query = Product.find(JSON.parse(queryString));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    // Limiting the number of fileds
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      var productCount = await Product.countDocuments();
      if (skip >= productCount) {
        throw new Error("Page not found");
      }
    }

    const allProduct = await query;
    // const allProduct = await Product.find(query);

    if (allProduct) {
      res.status(201).json({
        products: allProduct,
        productCount,
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
