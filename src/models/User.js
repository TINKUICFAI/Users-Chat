const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "full name is required!"],
    },
    username: {
      type: String,
      required: [true, "username of the user is required!"],
    },
    password: {
      type: String,
      required: [true, "password of the user is required!"],
    },
    isAdmin: {
      type: Boolean,
      required: [true, "user type required!"],
    },
    token: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

var User = mongoose.model("User", UserSchema);

module.exports = User;
