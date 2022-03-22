const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is Required"],
  },
  price: {
    type: Number,
    required: [true, "Please give a price for this product"],
  },
  amount: {
    type: Number,
    required: [true, "A product must have an amount in stock"],
  },

  category: {
    type: String,
    required: [true, "Please fill in your Gender"],
    enum: ["clothes", "foods", "gadgets", "kids"],
  },

  description: {
    type: String,
    required: [true, "Please give a detailed description for this product"],
  },
});
const product = mongoose.model("Product", productSchema);
module.exports = product;
