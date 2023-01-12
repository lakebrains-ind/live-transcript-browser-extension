const mongoose = require("mongoose");

let userAuthSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//Export Mongoose model
let User = mongoose.model("user", userAuthSchema);
module.exports = User;
