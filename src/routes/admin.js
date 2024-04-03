const adminRouter = require("express").Router();
const UserController = require("../controllers/UserController");
const UsersValidator = require("../validators/UsersValidator");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

adminRouter.post(
  "/register",
  UsersValidator().validateAddAdmin,
  ErrorHandlerMiddleware(UserController().registerUser),
  ResponseMiddleware
);

/**
 * Manage Users
 */

adminRouter.post(
  "/users",
  AuthMiddleware().verifyAminToken,
  UsersValidator().validateAddUser,
  ErrorHandlerMiddleware(UserController().registerUser),
  ResponseMiddleware
);

adminRouter.get(
  "/users",
  AuthMiddleware().verifyAminToken,
  ErrorHandlerMiddleware(UserController().getAllUserList),
  ResponseMiddleware
);

adminRouter.get(
  "/users/:id",
  AuthMiddleware().verifyAminToken,
  UsersValidator().validateUserId,
  ErrorHandlerMiddleware(UserController().getDetails),
  ResponseMiddleware
);

adminRouter.put(
  "/users/:id",
  AuthMiddleware().verifyAminToken,
  UsersValidator().validateUserId,
  ErrorHandlerMiddleware(UserController().editUser),
  ResponseMiddleware
);

module.exports = adminRouter;
