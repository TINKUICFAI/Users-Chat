const Groups = require("../models/Groups");
var ObjectId = require("mongoose").Types.ObjectId;

module.exports = () => {
  const addGroups = (data) => {
    console.log("GroupsService => addGroups");
    return new Promise(function (resolve, reject) {
      Groups.create(data).then(resolve).catch(reject);
    });
  };

  const fetch = (id) => {
    console.log("GroupsService => fetch");
    return new Promise(function (resolve, reject) {
      let odm = Groups.findById(id);
      odm.then(resolve).catch(reject);
    });
  };

  const fetchByQuery = (query) => {
    console.log("GroupsService => fetchByQuery");
    return new Promise(function (resolve, reject) {
      let odm = Groups.findOne(query).select("-password");

      odm.then(resolve).catch(reject);
    });
  };

  const deleteGroups = (id) => {
    console.log("GroupsService => deleteGroups");
    return new Promise(function (resolve, reject) {
      let odm = Groups.deleteOne({ _id: id });
      odm.then(resolve).catch(reject);
    });
  };

  const updateGroups = (GroupsId, data) => {
    console.log("GroupsService => updateGroups");
    return new Promise(async function (resolve, reject) {
      await Groups.findByIdAndUpdate({ _id: GroupsId }, data)
        .then(resolve)
        .catch(reject);
    });
  };

  const getGroups = (query, page, limit) => {
    console.log("GroupsService => getGroups");

    if (page) {
      page -= 1;
    }

    return new Promise(function (resolve, reject) {
      let odm = Groups.find(query)
        .sort({ _id: -1 })
        .skip(page * limit)
        .limit(limit);
      odm.then(resolve).catch(reject);
    });
  };

  const fetchDetailWithMembers = (id) => {
    console.log("GroupsService => fetchDetailWithMembers");
    return new Promise(function (resolve, reject) {
      let odm = Groups.aggregate([
        {
          $match: { _id: new ObjectId(id), isDeleted: false },
        },
        {
          $lookup: {
            from: "groupmembers",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$groupId", "$$id"] },
                },
              },
              {
                $lookup: {
                  from: "users",
                  let: { userId: "$userId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$userId"] },
                      },
                    },
                    { $project: { _id: 1, fullName: 1, username: 1 } },
                  ],
                  as: "members",
                },
              },
              { $unwind: "$members" }, // Unwind to flatten the members array
              { $replaceRoot: { newRoot: "$members" } },
            ],
            as: "groupMembers",
          },
        },
        { $project: { _id: 1, name: 1, groupMembers: 1 } },
      ]);

      odm.then(resolve).catch(reject);
    });
  };

  const getGroupsWithMembers = (query, page, limit, userId) => {
    if (page) {
      page -= 1;
    }

    return new Promise(function (resolve, reject) {
      let orm = Groups.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: "groupmembers",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$groupId", "$$id"] },
                  userId,
                },
              },
            ],
            as: "groupMembers",
          },
        },
        { $project: { name: 1 } },
        { $skip: page * limit },
        { $limit: limit },
        { $sort: { rank: 1 } },
      ]);

      orm.then(resolve).catch(reject);
    });
  };

  const countGroups = (query) => {
    console.log("GroupsService => countGroups");
    return new Promise(function (resolve, reject) {
      let odm = Groups.countDocuments(query);
      odm.then(resolve).catch(reject);
    });
  };

  return {
    addGroups,
    fetch,
    fetchByQuery,
    deleteGroups,
    updateGroups,
    getGroups,
    countGroups,
    getGroupsWithMembers,
    fetchDetailWithMembers,
  };
};
