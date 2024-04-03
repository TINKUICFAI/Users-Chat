const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const GroupMemberSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

var GroupMember = mongoose.model("GroupMember", GroupMemberSchema);

module.exports = GroupMember;
