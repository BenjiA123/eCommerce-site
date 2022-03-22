const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");
const User = require("../models/userModel");
exports.getOverview = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render("overview", {
    title: "All Products",
    products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).render("product", { title: `${product.name}`, product });
});

exports.getCart = catchAsync(async (req, res, next) => {
  res.status(200).render("cart");
});

exports.me = catchAsync(async (req, res, next) => {
  res.status(200).render("account");
});

exports.welcome = catchAsync(async (req, res, next) => {
  console.log("This is welcome");
  res.status(200).render("welcome");
});
