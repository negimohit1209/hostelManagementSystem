var mongoose = require("mongoose");

var billSchema = new mongoose.Schema({
  wardenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  boarderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: Number,
  timestamp: Number,
  duedate: String,
  name: String,
  paid: {
    type: Number,
    default: 0
  },
  paidtime: Number,
  avatar: {
    type: String,
    default: "https://dontpakao.files.wordpress.com/2015/06/no-pic-boy.jpg"
  }
});

module.exports = mongoose.model("Bill", billSchema);
