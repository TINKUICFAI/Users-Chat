const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const MessageSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: [true, "message required!"],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

var Messages = mongoose.model("Message", MessageSchema);

module.exports = Messages;
