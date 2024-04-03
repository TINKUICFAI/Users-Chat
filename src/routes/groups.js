const groupRouter = require("express").Router();
const GroupController = require("../controllers/GroupController");
const GroupsValidator = require("../validators/GroupsValidator");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

groupRouter.post(
  "/",
  AuthMiddleware().verifyUserToken,
  GroupsValidator().validateAddGroup,
  ErrorHandlerMiddleware(GroupController().addGroup),
  ResponseMiddleware
);

groupRouter.get(
  "/",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(GroupController().getAllGroupList),
  ResponseMiddleware
);

groupRouter.get(
  "/:id",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(GroupController().getDetails),
  ResponseMiddleware
);

groupRouter.put(
  "/:id",
  AuthMiddleware().verifyGroupAdminToken,
  ErrorHandlerMiddleware(GroupController().editGroup),
  ResponseMiddleware
);

groupRouter.delete(
  "/:id",
  AuthMiddleware().verifyGroupAdminToken,
  ErrorHandlerMiddleware(GroupController().editGroup),
  ResponseMiddleware
);

/**
 * Manage Members
 */

groupRouter.post(
  "/:id/members",
  AuthMiddleware().verifyGroupAdminToken,
  GroupsValidator().validateAddGroupMember,
  ErrorHandlerMiddleware(GroupController().addMember),
  ResponseMiddleware
);

groupRouter.get(
  "/:id/members",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(GroupController().getAllGroupMembers),
  ResponseMiddleware
);

/**
 * Manage Group messages
 */

groupRouter.post(
  "/:id/messages",
  AuthMiddleware().verifyUserToken,
  GroupsValidator().validateGroupMessage,
  ErrorHandlerMiddleware(GroupController().sendMessage),
  ResponseMiddleware
);

groupRouter.get(
  "/:id/messages",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(GroupController().getGroupMessages),
  ResponseMiddleware
);

/**
 * Like message
 */

groupRouter.get(
  "/:id/messages/:messageId/likes",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(GroupController().likeMessage),
  ResponseMiddleware
);

module.exports = groupRouter;
