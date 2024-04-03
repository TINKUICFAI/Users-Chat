const Users = require("../models/User");
const helpers = require("../util/helpers");

module.exports = () => {
  const addUsers = (data) => {
    console.log("UsersService => addUsers");
    return new Promise(function (resolve, reject) {
      Users.create(data).then(resolve).catch(reject);
    });
  };

  const fetch = (id) => {
    console.log("UsersService => fetch");
    return new Promise(function (resolve, reject) {
      let odm = Users.findById(id).select("-password -token -__v");
      odm.then(resolve).catch(reject);
    });
  };

  const fetchByQuery = (query) => {
    console.log("UsersService => fetchByQuery");
    return new Promise(function (resolve, reject) {
      let odm = Users.findOne(query).select("-password");

      odm.then(resolve).catch(reject);
    });
  };

  const updateUsers = (UsersId, data) => {
    console.log("UsersService => updateUsers");
    return new Promise(async function (resolve, reject) {
      await Users.findByIdAndUpdate({ _id: UsersId }, data)
        .then(resolve)
        .catch(reject);
    });
  };

  const getUsers = (query, page, limit) => {
    console.log("UsersService => getUsers");

    if (page) {
      page -= 1;
    }

    return new Promise(function (resolve, reject) {
      let odm = Users.find(query)
        .select("-token -password -__v")
        .sort({ _id: -1 })
        .skip(page * limit)
        .limit(limit);

      odm.then(resolve).catch(reject);
    });
  };

  const countUsers = (query) => {
    console.log("UsersService => countUsers");
    return new Promise(function (resolve, reject) {
      let odm = Users.countDocuments(query);
      odm.then(resolve).catch(reject);
    });
  };

  const verifyPassword = (id, password) => {
    console.log("UserService => verifyPassword");
    return new Promise(async function (resolve, reject) {
      let user = await Users.findById(id);

      if (!user) resolve(false);
      let v = await helpers().checkPassword(password, user.password);

      return resolve(v);
    });
  };

  return {
    addUsers,
    fetch,
    fetchByQuery,
    updateUsers,
    getUsers,
    countUsers,
    verifyPassword,
  };
};
