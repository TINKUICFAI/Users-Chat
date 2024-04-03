const GroupMembers = require("../models/GroupMembers");

module.exports = () => {
  const addGroupMembers = (data) => {
    console.log("GroupMembersService => addGroupMembers");
    return new Promise(function (resolve, reject) {
      GroupMembers.create(data).then(resolve).catch(reject);
    });
  };

  const fetch = (id) => {
    console.log("GroupMembersService => fetch");
    return new Promise(function (resolve, reject) {
      let odm = GroupMembers.findById(id);
      odm.then(resolve).catch(reject);
    });
  };

  const fetchByQuery = (query) => {
    console.log("GroupMembersService => fetchByQuery");
    return new Promise(function (resolve, reject) {
      let odm = GroupMembers.findOne(query).select("-password");

      odm.then(resolve).catch(reject);
    });
  };

  const deleteGroupMembers = (id) => {
    console.log("GroupMembersService => deleteGroupMembers");
    return new Promise(function (resolve, reject) {
      let odm = GroupMembers.deleteOne({ _id: id });
      odm.then(resolve).catch(reject);
    });
  };

  const updateGroupMembers = (GroupMembersId, data) => {
    console.log("GroupMembersService => updateGroupMembers");
    return new Promise(async function (resolve, reject) {
      await GroupMembers.findByIdAndUpdate({ _id: GroupMembersId }, data)
        .then(resolve)
        .catch(reject);
    });
  };

  const getGroupMembers = (query, page, limit) => {
    console.log("GroupMembersService => getGroupMembers");

    if (page) {
      page -= 1;
    }

    return new Promise(function (resolve, reject) {
      let odm = GroupMembers.find(query)
        .sort({ _id: -1 })
        .skip(page * limit)
        .limit(limit);
      odm.then(resolve).catch(reject);
    });
  };

  const countGroupMembers = (query) => {
    console.log("GroupMembersService => countGroupMembers");
    return new Promise(function (resolve, reject) {
      let odm = GroupMembers.countDocuments(query);
      odm.then(resolve).catch(reject);
    });
  };

  return {
    addGroupMembers,
    fetch,
    fetchByQuery,
    deleteGroupMembers,
    updateGroupMembers,
    getGroupMembers,
    countGroupMembers,
  };
};
