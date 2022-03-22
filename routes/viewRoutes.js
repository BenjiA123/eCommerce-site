var express = require("express");
var viewRouter = express.Router();
const viewsController = require("../controllers/viewController");

/* GET home page. */
viewRouter.get("/", viewsController.getOverview);
viewRouter.get("/product/:id", viewsController.getProduct);
viewRouter.get("/cart", viewsController.getCart);
viewRouter.get("/account", viewsController.me);
viewRouter.get("/welcome", viewsController.welcome);

module.exports = viewRouter;
