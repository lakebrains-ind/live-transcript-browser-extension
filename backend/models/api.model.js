const mongoose = require("mongoose");

let apiModel = mongoose.Schema({
  appId:{
    type:String,
    require:true
  },
  appSecret:{
    type:String,
    require:true
  },
  expire:{
    type:Boolean,
    require:true
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
let Api = mongoose.model("api", apiModel);
module.exports = Api;
