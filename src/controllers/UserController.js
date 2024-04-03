const UserService = require("../services/UserService");
const helpers = require("../util/helpers.js");

module.exports = () => {
  const registerUser = async (req, res, next) => {
    console.log("UserController => registerUser");
    let { fullName, password, username, isAdmin } = req.body;

    username = username.toLowerCase();
    let query = { username };
    let user = await UserService().fetchByQuery(query);

    if (user) {
      req.rCode = 0;
      req.msg = "user_already_found";
      req.rData = {};
    } else {
      password = await helpers().hashPassword(password);
      user = { username, password, fullName, isAdmin };

      await UserService().addUsers(user);

      user = await UserService().fetchByQuery(query);

      req.rData = {};
    }

    next();
  };

  const login = async (req, res, next) => {
    console.log("UserController => login");

    let { username, password } = req.body;

    username = username.toLowerCase();
    let query = { username };
    let user = await UserService().fetchByQuery(query);
    let token = "";
    if (user) {
      let isAdmin = false;

      if (user.isAdmin) {
        isAdmin = true;
      }

      token = await helpers().createJWT({
        userId: user._id,
        isAdmin: isAdmin,
      });

      let passwordVerify = await UserService().verifyPassword(
        user._id,
        password
      );

      if (!passwordVerify) {
        req.rCode = 0;
        req.msg = "incorrect_password";
        req.rData = {};
      } else {
        await UserService().updateUsers(user._id, { token });

        req.rData = { token };
      }
    } else {
      req.rCode = 0;
      req.msg = "user_not_found";
      req.rData = {};
    }

    next();
  };

  const logout = async (req, res, next) => {
    console.log("UserController => logout");
    let { userId } = req.body;

    let user = { token: null };
    user = await UserService().updateUsers(userId, user);
    req.msg = "logout";
    next();
  };

  /**
   * List of Users
   */
  const getAllUserList = async (req, res, next) => {
    console.log("UserController => getAllUserList");
    let { search, page, limit } = req.query;
    let { adminId } = req.body;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;

    let query = {};

    if (adminId) {
      query._id = { $ne: adminId };
    }

    if (search) {
      query = {
        $or: [
          {
            fullName: { $regex: RegexEscape(search), $options: "i" },
          },
          {
            username: { $regex: RegexEscape(search), $options: "i" },
          },
        ],
      };
    }

    let user = await UserService().getUsers(query, page, limit);
    let total_user = await UserService().countUsers(query);

    req.msg = "users_list";

    req.rData = {
      search,
      page,
      limit,
      total_user,
      user,
    };

    next();
  };

  const getDetails = async (req, res, next) => {
    console.log("UserController => getDetails");
    let { id } = req.params;
    let user = await UserService().fetch(id);

    if (user) {
      req.msg = "success";
      req.rData = user;
    } else {
      req.rCode = 5;
      req.msg = "user_not_found";
      req.rData = {};
    }

    next();
  };

  const editUser = async (req, res, next) => {
    console.log("UserController => editUser");
    let { fullName, password, username, isAdmin } = req.body;
    let { id } = req.params;

    if (username) req.body.username = username.toLowerCase();
    if (password) req.body.password = await helpers().hashPassword(password);

    await UserService().updateUsers(id, req.body);

    req.rData = {};

    next();
  };

  return {
    /**
     * Auth
     */
    registerUser,
    login,
    logout,
    /**
     * Users
     */
    getAllUserList,
    getDetails,
    editUser,
  };
};
