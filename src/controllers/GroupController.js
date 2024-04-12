const GroupService = require("../services/GroupService");
const GroupMembersService = require("../services/GroupMembersService");
const MessageService = require("../services/MessageService");
const RegexEscape = require("regex-escape");
var ObjectId = require("mongoose").Types.ObjectId;

module.exports = () => {
  const addGroup = async (req, res, next) => {
    console.log("GroupController => addGroup");
    let { userId, name } = req.body;

    let creatorId = userId;

    let Group = await GroupService().addGroups({
      name,
      creatorId,
    });

    await GroupMembersService().addGroupMembers({
      userId,
      groupId: Group._id,
    });

    req.rData = Group;
    req.msg = "success";
    next();
  };

  const getAllGroupList = async (req, res, next) => {
    console.log("GroupController => getAllGroupList");
    let { search, page, limit } = req.query;

    let { userId } = req.body;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;

    let query = { isDeleted: false };

    if (search) {
      query.name = { $regex: RegexEscape(search), $options: "i" };
    }

    let groups = await GroupService().getGroupsWithMembers(
      query,
      page,
      limit,
      userId
    );

    // let total_Group = await GroupService().countGroups({ userId });

    req.msg = "success";

    req.rData = {
      search,
      page,
      limit,
      // total_Group,
      groups,
    };

    next();
  };

  const getDetails = async (req, res, next) => {
    console.log("GroupController => getDetails");
    let { id } = req.params;
    let group = await GroupService().fetch(id);

    if (group) {
      req.msg = "success";
      req.rData = group;
    } else {
      req.rCode = 5;
      req.msg = "group_not_found";
      req.rData = {};
    }

    next();
  };

  const editGroup = async (req, res, next) => {
    console.log("GroupController => editGroup");

    let { id } = req.params;
    let { userId, name } = req.body;

    let Group = await GroupService().fetchByQuery({
      creatorId: userId,
      _id: id,
    });

    if (Group) {
      await GroupService().updateGroups(id, { name });
      req.rData = {};
      req.msg = "success";
    } else {
      req.rCode = 4;
      req.msg = "forbidden";
      req.rData = {};
    }

    next();
  };

  const deleteGroup = async (req, res, next) => {
    console.log("GroupController => deleteGroup");
    let { id } = req.params;
    let { userId, name } = req.body;

    let Group = await GroupService().fetchByQuery({
      creatorId: userId,
      _id: id,
    });

    if (Group) {
      await GroupService().updateGroups(id, { isDeleted: true });
      req.rData = {};
      req.msg = "success";
    } else {
      req.rCode = 4;
      req.msg = "forbidden";
      req.rData = {};
    }

    next();
  };

  /**
   * Manage Group Member
   */

  const addMember = async (req, res, next) => {
    console.log("GroupController => addMember");
    let { memberId } = req.body;

    let { id } = req.params;

    let group = await GroupMembersService().fetchByQuery({
      userId: memberId,
      groupId: id,
    });

    if (group) {
      req.rData = {};
      req.msg = "user_exist_in_group";
    } else {
      await GroupMembersService().addGroupMembers({
        groupId: id,
        userId: memberId,
      });

      req.rData = {};
      req.msg = "success";
    }

    next();
  };

  const getAllGroupMembers = async (req, res, next) => {
    console.log("GroupController => getAllGroupMembers");
    let { id } = req.params;

    let group = await GroupService().fetchDetailWithMembers(id);

    if (group[0]) {
      req.msg = "success";
      req.rData = group[0];
    } else {
      req.rCode = 5;
      req.msg = "group_not_found";
      req.rData = {};
    }

    next();
  };

  /**
   * Send Message
   */

  const sendMessage = async (req, res, next) => {
    console.log("GroupController => sendMessage");
    let { message, userId } = req.body;

    let { id } = req.params;

    await MessageService().addMessages({
      senderId: userId,
      groupId: id,
      message,
    });

    req.msg = "success";
    next();
  };

  const getGroupMessages = async (req, res, next) => {
    console.log("GroupController => getGroupMessages");
    let { page, limit } = req.query;
    let { id } = req.params;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;

    let messages = await MessageService().getMessages(
      { groupId: new ObjectId(id) },
      page,
      limit
    );

    // let total_Group = await GroupService().countGroups({ userId });

    req.msg = "success";

    req.rData = {
      page,
      limit,
      // total_Group,
      messages,
    };

    next();
  };

  const likeMessage = async (req, res, next) => {
    console.log("GroupController => likeMessage");

    let { id, messageId } = req.params;

    await MessageService().updateMessages(messageId, { $inc: { likes: 1 } });

    next();
  };

  return {
    addGroup,
    getDetails,
    getAllGroupList,
    editGroup,
    deleteGroup,
    /**
     * Group Members
     */
    addMember,
    getAllGroupMembers,
    /**
     * Manage messages
     */
    sendMessage,
    getGroupMessages,
    likeMessage,
  };
};
