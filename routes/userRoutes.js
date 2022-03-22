var express = require("express");
var userRouter = express.Router();
const userController = require("../controllers/usersControllers");
const authController = require("../controllers/authController");

userRouter.post("/login", authController.login);
userRouter.post("/signup", authController.signup);

userRouter
  .route("/")
  .post(authController.protect, userController.createUser)
  .get(userController.getAllUsers);

userRouter
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
