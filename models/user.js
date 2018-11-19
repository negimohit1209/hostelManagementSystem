
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
    password: String,
    email: {
        type: String,
        require: false,
        trim: true,
        minlength:0,
    },
    firstName: {
        type: String,
        require: false,
        trim: true,
        minlength:1
    },
    lastName: {
        type: String,
        require: false,
        trim: true,
        minlength:1
    },
    dob: {
        type: String,
        require: false,
        trim: true,
        minlength:1
    },
    sex: {
        type: String,
        require: false,
        trim: true,
        minlength:1
    },
    address: {
        type: String,
        require: false,
        trim: true,
        minlength:1
    },
    city: {
        type: String,
        require: false,
        trim: true,
        minlength:1
    },
    state: {
        type: String,
        require: false,
        trim: true,
        minlength:1
    },
    country: {
        type: String,
        require: false,
        trim: true,
        minlength:1
    },
    pincode: {
        type: Number,
        require: false,
        trim: true,
        minlength: 6
    },
    areacode: {
        type: String,
        require: false,
        trim: true,
        minlength: 1
    },
    phoneno: {
        type: String,
        require: false,
        trim: true,
        minlength: 10
    },
    college: {
        type: String,
        require: false,
        trim: true,
        minlength: 1
    },
    cover: {
        type: String
    },
    semester: {
        type: String,
        require: false,
        trim: true,
        minlength: 1
    },
    department: {
        type: String,
        require: false,
        trim: true,
        minlength: 1
    },
    role: {
        type: String,
        require: false,
        trim: true,
        minlength: 1
    },
    income:{
        type: Number,
        require: false,
        trim: true,
        minlength: 1
    },
    bio:{
        type: String,
    },
    avatar: {
        type: String,
        default: "https://dontpakao.files.wordpress.com/2015/06/no-pic-boy.jpg"
    },
    distance:{
        type: Number,
        require: false,
        trim: true,
        minlength: 1
    },
    hostel: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hostel"
        },
        name: String},
    applied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel"
    }]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);