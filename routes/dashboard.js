var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var passport = require("passport");
var User = require("../models/user");
var Hostel = require("../models/hostel");
var Application = require("../models/application");
var Bill = require("../models/bill");

router.get("/", middleware.isLoggedIn, (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log(err);
    } else {
      res.render("user/index", { currentUser: req.user, users: users });
    }
  });
});

// profile
router.get("/profile", middleware.isLoggedIn, (req, res) => {
  res.render("user/profile", { currentUser: req.user, user: req.user });
});

router.get("/profile/:id", middleware.isLoggedIn, (req, res) => {
  var userid = req.params.id;
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.render("user/profile", { currentUser: req.user, user: user });
    }
  });
});

router.post("/profile/:id", middleware.isLoggedIn, (req, res) => {
  var userid = req.params.id;
  console.log(req.body);
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      console.log(err);
    } else {
      user.bio = req.body.bio;
      // console.log(user);
      user.save().then(() => {
        res.redirect("/dashboard/profile");
      });
    }
  });
});

router.get("/profile/:id/edit", middleware.isLoggedIn, (req, res) => {
  var userid = req.params.id;
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.render("user/edit", { currentUser: req.user, user: user });
    }
  });
});

// Admin hostel part
router.get("/hostels", middleware.isLoggedIn, (req, res) => {
  if (req.user.role === "admin") {
    Hostel.find(
      {
        admin: {
          id: req.user._id,
          username: req.user.username
        }
      },
      (err, allHostels) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(allHostels[0].warden);
          res.render("hostel/index", {
            hostels: allHostels,
            currentUser: req.user
          });
        }
      }
    );
  }
  if (req.user.role === "student") {
    Hostel.find({ college: "IIEST, Shibpur" }, (err, allHostels) => {
      if (err) {
        console.log(err);
      } else {
        res.render("hostel/index", {
          hostels: allHostels,
          currentUser: req.user
        });
      }
    });
  }
  if (req.user.role === "warden") {
    Hostel.find({}, (err, allHostels) => {
      if (err) {
        console.log(err);
      } else {
        res.render("hostel/index", {
          hostels: allHostels,
          currentUser: req.user
        });
      }
    });
  }
});

router.post("/hostels", middleware.isLoggedIn, (req, res) => {
  console.log(req.body);
  var hostel = {};
  if (req.body.name.length !== 0) {
    hostel.name = req.body.name;
  }
  if (req.body.year.length !== 0) {
    hostel.year = req.body.year;
  }
  if (req.body.room.length !== 0) {
    hostel.room = req.body.room;
  }
  if (req.body.seater.length !== 0) {
    hostel.seater = req.body.seater;
  }
  if (req.body.rent.length !== 0) {
    hostel.rent = req.body.rent;
  }

  if (req.body.address.length !== 0) {
    hostel.address = req.body.address;
  }
  if (req.body.city.length !== 0) {
    hostel.city = req.body.city;
  }
  if (req.body.state.length !== 0) {
    hostel.state = req.body.state;
  }
  if (req.body.pincode.length !== 0) {
    hostel.pincode = req.body.pincode;
  }

  if (req.body.image.length !== 0) {
    hostel.image = req.body.image;
  }

  hostel.desc = req.body.desc;
  hostel.college = req.body.college;

  hostel.sex = req.body.sex;

  hostel.admin = {
    id: req.user._id,
    username: req.user.username
  };
  console.log(hostel);
  Hostel.create(hostel, (err, hostel) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(hostel);
      res.redirect("/dashboard/hostels");
    }
  });
});

router.get("/hostels/new", middleware.isLoggedIn, (req, res) => {
  res.render("hostel/addHostel", { currentUser: req.user });
});

router.get("/hostels/:id", middleware.isLoggedIn, (req, res) => {
  Hostel.findById(req.params.id).exec((err, hostel) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(hostel.admin.id);
      // console.log(req.user._id);
      res.render("hostel/show", { hostel: hostel, currentUser: req.user });
    }
  });
});

router.get("/hostels/:id/edit", middleware.isLoggedIn, (req, res) => {
  res.send("edit page coming soon");
});

router.post(
  "/hostels/:hostelid/apply/:role/:userid",
  middleware.isLoggedIn,
  (req, res) => {
    var hostelId = req.params.hostelid;
    var userId = req.params.userid;
    var role = req.params.role;
    Hostel.findById(hostelId, (err, hostel) => {
      if (err) {
        console.log(err);
      } else {
        User.findById(userId, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            var application = {
              role,
              userId,
              hostelId,
              timestamp: new Date().getTime(),
              adminId: hostel.admin.id,
              firstName: user.firstName,
              lastName: user.lastName,
              hostelName: hostel.name
            };
            if (user.distance) {
              application.distance = user.distance;
            }
            if (user.income) {
              application.income = user.income;
            }
            if (user.distance && user.income) {
              application.priority = Math.floor(user.income / user.distance);
            }

            // console.log(application);
            Application.create(application, (err, application) => {
              if (err) {
                console.log(err);
              } else {
                // console.log(application);
                user.applied.push(hostel._id);
                user.save();
                res.redirect("/dashboard/hostels");
              }
            });
          }
        });
      }
    });
  }
);

router.get("/hostels/:hostelid/boarders", middleware.isLoggedIn, (req, res) => {
  var hostelId = req.params.hostelid;
  Hostel.findById(hostelId, (err, hostel) => {
    if (err) {
      console.log(err);
    } else {
      User.find(
        {
          hostel: {
            id: hostel._id,
            name: hostel.name
          },
          role: "student"
        },
        (err, allUsers) => {
          if (err) {
            console.log(err);
          } else {
            console.log(allUsers);
            res.render("hostel/boarder", {
              currentUser: req.user,
              boarder: allUsers
            });
          }
        }
      );
    }
  });
});

module.exports = router;
