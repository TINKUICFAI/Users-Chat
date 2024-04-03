const mongoose = require("mongoose");
const User = require("./User");
const GroupMembers = require("./GroupMembers");
const Groups = require("./Groups");
const Messages = require("./Messages");

const url = process.env.LOCAL_MONGO_DB;
mongoose.connect(url);

const con = mongoose.connection;
// mongoose.set("debug", true);

con.on("open", () => {
  console.log("connected to database");
});

const models = {
  User,
  Messages,
  GroupMembers,
  Groups,
};

module.exports = { models };
