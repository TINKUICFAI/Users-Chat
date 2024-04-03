const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "group name is required!"],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

var Groups = mongoose.model("Group", GroupSchema);

module.exports = Groups;
