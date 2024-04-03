const Messages = require("../models/Messages");

module.exports = () => {
  const addMessages = (data) => {
    console.log("MessagesService => addMessages");
    return new Promise(function (resolve, reject) {
      Messages.create(data).then(resolve).catch(reject);
    });
  };

  const fetch = (id) => {
    console.log("MessagesService => fetch");
    return new Promise(function (resolve, reject) {
      let odm = Messages.findById(id);
      odm.then(resolve).catch(reject);
    });
  };

  const fetchByQuery = (query) => {
    console.log("MessagesService => fetchByQuery");
    return new Promise(function (resolve, reject) {
      let odm = Messages.findOne(query).select("-password");

      odm.then(resolve).catch(reject);
    });
  };

  const deleteMessages = (id) => {
    console.log("MessagesService => deleteMessages");
    return new Promise(function (resolve, reject) {
      let odm = Messages.deleteOne({ _id: id });
      odm.then(resolve).catch(reject);
    });
  };

  const updateMessages = (MessagesId, data) => {
    console.log("MessagesService => updateMessages");
    return new Promise(async function (resolve, reject) {
      await Messages.findByIdAndUpdate({ _id: MessagesId }, data)
        .then(resolve)
        .catch(reject);
    });
  };

  const getMessages = (query, page, limit) => {
    console.log("MessagesService => getMessages");

    if (page) {
      page -= 1;
    }
    return new Promise(function (resolve, reject) {
      let odm = Messages.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "groups",
            let: { groupId: "$groupId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$groupId"] },
                },
              },
              { $project: { _id: 1, name: 1 } },
            ],
            as: "group",
          },
        },
        { $unwind: "$group" }, // Unwind to flatten the members array
        {
          $lookup: {
            from: "users",
            let: { senderId: "$senderId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$senderId"] },
                },
              },
              { $project: { _id: 1, fullName: 1, username: 1 } },
            ],
            as: "member",
          },
        },
        { $unwind: "$member" }, //
        { $project: { message: 1, member: 1, group: 1, likes: 1 } },
        { $skip: page * limit },
        { $limit: limit },
        // { $sort: { _id: -1 } },
      ]);

      odm.then(resolve).catch(reject);
    });
  };

  const countMessages = (query) => {
    console.log("MessagesService => countMessages");
    return new Promise(function (resolve, reject) {
      let odm = Messages.countDocuments(query);
      odm.then(resolve).catch(reject);
    });
  };

  return {
    addMessages,
    fetch,
    fetchByQuery,
    deleteMessages,
    updateMessages,
    getMessages,
    countMessages,
  };
};
