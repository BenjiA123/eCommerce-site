var express = require("express");
var orderRouter = express.Router();
const orderController = require("../controllers/orderController");
const AuthController = require("../controllers/authController");

orderRouter.use(AuthController.protect);

orderRouter
  .route("/")
  .post(orderController.createOrder)
  .get(orderController.getAllOrders);

orderRouter
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

orderRouter
  .route("/paystack/initialize")
  .post(orderController.initializePaystackTransaction);

orderRouter
  .route("/paystack/verify")
  .get(orderController.verifyPaystackTransaction);
module.exports = orderRouter;
