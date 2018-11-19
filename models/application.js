var mongoose = require("mongoose");

var applicationSchema = new mongoose.Schema({
    role: String,
    status: {
        type: String,
        default: "Pending"
    },
    userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
    hostelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel"
    },
    timestamp: {
        type: Number
    },
    checkedAt: {
        type: Number
    },
    distance: {
        type: Number
    },
    priority:{
        type: Number
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    income: {
        type: Number
    },
    hostelName: {
        type: String
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Application", applicationSchema);