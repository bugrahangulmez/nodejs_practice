const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    required: true,
    type: String,
  },
  roles: {
    User: {
      type: Number,
      default: 300,
    },
    Editor: Number,
    Admin: Number,
  },
  pwd: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
