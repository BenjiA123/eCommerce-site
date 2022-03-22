const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User is Required"],
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Product is Required"],
      },
      quantity: { type: Number },
    },
  ],

  totalPrice: {
    required: false,
    type: Number,
  },
  reference: {
    type: String,
    required: false,
    default: "",
  },
  verified: {
    required: true,
    default: false,
    type: Boolean,
  },
});
const order = mongoose.model("Order", orderSchema);
module.exports = order;
