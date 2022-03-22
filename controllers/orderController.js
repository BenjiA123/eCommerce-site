const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const request = require("request");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
const Product = require("../models/productModel");
exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOne(Order);
exports.createOrder = factory.createOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);

// exports.createFlutterwavePayment
var mongoose = require("mongoose");

exports.initializePaystackTransaction = catchAsync(async (req, res, next) => {
  // req.body.products = [
  //   {
  //     productId: mongoose.Types.ObjectId("6213317d44b06fa2dc12c6c6"),
  //     quantity: 2,
  //   },
  //   {
  //     productId: mongoose.Types.ObjectId("621330e844b06fa2dc12c6c1"),
  //     quantity: 1,
  //   },
  // ];
  req.body.products.forEach((el) => {
    el.productId = mongoose.Types.ObjectId(el.productId);
  });

  const document = req.body.products;
  var initalProductQuantity;
  var x = [];
  for (index = 0; index < document.length; index++) {
    const product = await Product.findById(document[index].productId._id);
    if (!product) {
      return next(new AppError(`Their are no product with this Id`, 400));
    }
    initalProductQuantity = document[index].quantity;
    x.push(initalProductQuantity * product.price);
    if (product.amount == 0 || product.amount - document[index].quantity < 0)
      return next(
        new AppError(`We do not have enough In Stock for this Order `, 500)
      );

    let currentAmount = product.amount - document[index].quantity;
    await Product.findByIdAndUpdate(product._id, { amount: currentAmount })
      .lean()
      .exec();
  }
  for (let index = 0; index < x.length; index++) {
    const num = x[index];
    if (index + 1 < x.length) {
      totalPrice = num + x[index + 1];
    }
  }

  const order = await Order.create({
    user: req.user._id,
    products: req.body.products,
    reference: "",
    totalPrice,
  });
  const options = {
    url: "https://api.paystack.co/transaction/initialize",
    headers: {
      authorization: `Bearer ${process.env.PAYSTACK_SECRETEKEY}`,
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    form: {
      amount: totalPrice,
      email: "food@food.com",
      // email: req.user.email,
      phone: req.user.phoneNumber,
      first_name: req.user.name.split(" ")[0],
      last_name: req.user.name.split(" ")[1],
      metadata: {
        order_id: order._id,
      },
    },
  };

  request.post(
    options,
    async (paystackError, paystackResponse, paystackBody) => {
      const resBody = JSON.parse(paystackResponse.body);
      console.log(resBody);
      await Order.findByIdAndUpdate(order._id, {
        reference: resBody.data.reference,
      });
      res.redirect(resBody.data.authorization_url);
    }
  );
});

exports.verifyPaystackTransaction = catchAsync(async (req, res, next) => {
  const ref = req.query.reference;

  const option = {
    url:
      "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
    headers: {
      authorization: `Bearer ${process.env.PAYSTACK_SECRETEKEY}`,
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
  };

  request(option, async (error, response, body) => {
    const parsedBody = JSON.parse(body);

    console.log(parsedBody.data.customer);
    // await Order.findByIdAndUpdate(parsedBody.data.customer.metadata.order_id, {
    //   reference: parsedBody.data.reference,
    // });
  });

  res.redirect("/");
});
