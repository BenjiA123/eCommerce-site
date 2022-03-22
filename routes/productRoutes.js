var express = require("express");
var productRouter = express.Router();
const productController = require("../controllers/productController");

productRouter
  .route("/")
  .post(productController.createProduct)
  .get(productController.getAllProducts);

productRouter
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = productRouter;
