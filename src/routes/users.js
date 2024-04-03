const userRouter = require("express").Router();
const UserController = require("../controllers/UserController");
const UsersValidator = require("../validators/UsersValidator");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

/**users */

userRouter.post(
  "/login",
  UsersValidator().validateUserLogin,
  ErrorHandlerMiddleware(UserController().login),
  ResponseMiddleware
);

userRouter.get(
  "/logout",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(UserController().logout),
  ResponseMiddleware
);

module.exports = userRouter;
