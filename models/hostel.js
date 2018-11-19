var mongoose = require("mongoose");

var hostelSchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  lat: Number,
  lng: Number,
  rent: Number,
  room: Number,
  seater: Number,
  year: Number,
  sex: String,
  college: String,
  // studentApp: [{id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User"
  // },
  // studentTimestamp: {
  //     type: Number
  //   }}],
  // studentTimestamp : [{
  //   type: Number
  // }],
  // wardenApp: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User"
  // }],
  // wardenTimestamp : [{
  //   type: Number
  // }],
  warden: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
    avatar: String
  },
  admin: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Hostel", hostelSchema);
