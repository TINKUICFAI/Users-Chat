const jwt = require("jsonwebtoken");
const ResponseMiddleware = require("./ResponseMiddleware");
const JWTSECRET = process.env.JWTSECRET;
const UserService = require("../services/UserService");
const GroupService = require("../services/GroupService");

module.exports = () => {
  const verifyUserToken = async (req, res, next) => {
    console.log("AuthMiddleware => verifyUserToken");
    let usertoken = req.headers.authorization;

    try {
      if (usertoken) {
        let tokens = usertoken.split(" ");

        let token = tokens[1];
        // console.log("Token", token)
        let payload = jwt.verify(token, JWTSECRET);

        let user = await UserService().fetchByQuery({
          _id: payload.userId,
          token,
        });

        if (user && !user.isActive) {
          throw new Error("ac_deactivated");
        }

        //checking user must exist in our DB else throwing error
        if (user) {
          console.log(`User with ID ${user._id} entered.`);
          req.body.userId = user._id;
          next();
        } else {
          throw new Error("invalid_token");
        }
      } else {
        throw new Error("invalid_token");
      }
    } catch (ex) {
      // console.log("heres",ex)
      req.rCode = 3;
      req.msg = "invalid_token";
      if (ex.message == "ac_deactivated") req.msg = ex.message;

      ResponseMiddleware(req, res, next);
    }
  };

  const verifyAminToken = async (req, res, next) => {
    console.log("AuthMiddleware => verifyAminToken");
    let usertoken = req.headers.authorization;

    try {
      if (usertoken) {
        let tokens = usertoken.split(" ");

        let token = tokens[1];
        // console.log("Token", token)
        let payload = jwt.verify(token, JWTSECRET);

        if (!payload.isAdmin) {
          throw new Error("invalid_token");
        }

        let user = await UserService().fetchByQuery({
          _id: payload.userId,
          token,
        });

        if (user && !user.isActive) {
          throw new Error("ac_deactivated");
        }

        //checking user must exist in our DB else throwing error
        if (user) {
          console.log(`Admin with ID ${user._id} entered.`);
          req.body.adminId = user._id;
          req.authUser = user;
          next();
        } else {
          throw new Error("invalid_token");
        }
      } else {
        throw new Error("invalid_token");
      }
    } catch (ex) {
      // console.log("heres",ex)
      req.rCode = 4;
      req.msg = "invalid_token";

      ResponseMiddleware(req, res, next);
    }
  };

  const verifyGroupAdminToken = async (req, res, next) => {
    console.log("AuthMiddleware => verifyGroupAdminToken");
    let usertoken = req.headers.authorization;
    let { id } = req.params;
    try {
      if (usertoken) {
        let tokens = usertoken.split(" ");

        let token = tokens[1];
        // console.log("Token", token)
        let payload = jwt.verify(token, JWTSECRET);

        let user = await UserService().fetchByQuery({
          _id: payload.userId,
          token,
        });

        if (user && !user.isActive) {
          throw new Error("ac_deactivated");
        }

        let group = await GroupService().fetchByQuery({
          _id: id,
          creatorId: payload.userId,
        });

        if (!group) {
          throw new Error("forbidden");
        }

        //checking user must exist in our DB else throwing error
        if (user) {
          console.log(`User with ID ${user._id} entered.`);
          req.body.userId = user._id;
          next();
        } else {
          throw new Error("invalid_token");
        }
      } else {
        throw new Error("invalid_token");
      }
    } catch (ex) {
      // console.log("heres",ex)
      req.rCode = 3;
      req.msg = "invalid_token";
      if (ex.message == "ac_deactivated") req.msg = ex.message;
      if (ex.message == "forbidden") {
        req.rCode = 4;
        req.msg = "forbidden";
      }

      ResponseMiddleware(req, res, next);
    }
  };

  return {
    verifyUserToken,
    verifyAminToken,
    verifyGroupAdminToken,
  };
};
