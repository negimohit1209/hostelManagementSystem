var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var passport = require("passport");
var User = require("../models/user");
var Hostel = require("../models/hostel");
var Application = require("../models/application");
var compare = require("../middleware/sort");
// Promise = require('bluebird');
// mongoose.Promise = Promise;

router.get("/:role", middleware.isLoggedIn, (req, res) => {
  Application.find(
    {
      adminId: req.user._id,
      role: req.params.role,
      status: "Pending"
    },
    (err, allApplications) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(allApplications);
        res.render("application/index", {
          currentUser: req.user,
          applications: allApplications
        });
      }
    }
  );
});

router.get("/:hostelid/warden", middleware.isLoggedIn, (req, res) => {
  Application.find(
    {
      adminId: req.user._id,
      role: "warden",
      hostelId: req.params.hostelid
    },
    (err, allApplications) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(allApplications);
        res.render("application/hostelwarden", {
          currentUser: req.user,
          applications: allApplications
        });
      }
    }
  );
});

router.post("/:role", middleware.isLoggedIn, (req, res) => {
  Application.find(
    {
      adminId: req.user._id,
      role: req.params.role,
      status: "Pending"
    },
    (err, allApplications) => {
      if (err) {
        console.log(err);
      } else {
        allApplications.sort(compare);
        console.log(allApplications);
        allApplications.forEach(application => {
          User.findById(application.userId, (err, user) => {
            if (err) {
              console.log(err);
            } else {
              Hostel.findById(application.hostelId, (err, hostel) => {
                if (err) {
                  console.log(err);
                } else {
                  user.applied.shift();
                  if (typeof user.hostel.id === "undefined") {
                    if (hostel.seater * hostel.room > hostel.students.length) {
                      console.log(user);
                      user.hostel.id = hostel._id;
                      user.hostel.name = hostel.name;
                      hostel.students.push(user._id);
                      application.status = "Approved";
                      application.checkedAt = new Date().getTime();
                      // user.save();
                      // hostel.save();
                      // application.save();
                      user
                        .save()
                        .then(() => {
                          console.log("user saved");
                          hostel
                            .save()
                            .then(() => {
                              console.log("hostel saved");
                            })
                            .catch(e => console.log(e));
                        })
                        .then(() => {
                          application
                            .save()
                            .then(() => {
                              console.log("application saved");
                            })
                            .catch(e => console.log(e));
                        })
                        .catch(e => console.log(e));

                      // console.log(user.applied);
                      // console.log(hostel.id);
                      // console.log(application.status);
                      // console.log("1");
                    } else {
                      application.status = "Rejected";
                      application.checkedAt = new Date().getTime();
                      user
                        .save()
                        .then(() => {
                          console.log("user saved");
                          application
                            .save()
                            .then(() => {
                              console.log("application saved");
                            })
                            .catch(e => console.log(e));
                        })
                        .catch(e => console.log(e));

                      // console.log('2');
                    }
                  } else {
                    application.status = "Rejected";
                    application.checkedAt = new Date().getTime();
                    user
                      .save()
                      .then(() => {
                        console.log("user saved");
                        application
                          .save()
                          .then(() => {
                            console.log("application saved");
                          })
                          .catch(e => console.log(e));
                      })
                      .catch(e => console.log(e));
                    // console.log("3");
                  }
                }
              });
            }
          });
        });
        res.redirect("/dashboard/application/student/history");
      }
    }
  );
});

router.post("/:hostelid/warden/:userid/:status", (req, res) => {
  var hostelId = req.params.hostelid;
  var userId = req.params.userid;
  var status = req.params.status;
  if (status == "Approved") {
    Application.find(
      {
        status: "Pending",
        role: "warden",
        hostelId: hostelId
      },
      (err, allApplications) => {
        if (err) {
          console.log(err);
        } else {
          allApplications.forEach(application => {
            if (application.userId.equals(userId)) {
              application.status = "Approved";
              application.save();
              Hostel.findById(hostelId, (err, hostel) => {
                if (err) {
                  console.log(err);
                } else {
                  User.findById(userId, (err, user) => {
                    if (err) {
                      console.log(err);
                    } else {
                      hostel.warden.id = user._id;
                      hostel.warden.username = user.username;
                      hostel.warden.avatar = user.avatar;
                      user.hostel.id = hostel._id;
                      user.hostel.name = hostel.name;
                      hostel
                        .save()
                        .then(() => {
                          user.save();
                        })
                        .catch(e => console.log(e));
                    }
                  });
                }
              });
            } else {
              application.status = "Rejected";
              application.save();
            }
          });
        }
        res.redirect("/dashboard/hostels");
      }
    );
  } else {
    if (status == "Rejected") {
      Application.find(
        {
          userId: userId,
          hostelId: hostelId,
          role: "warden",
          status: "Pending"
        },
        (err, application) => {
          if (err) {
            console.log(err);
          } else {
            application[0].status = "Rejected";
            application[0].save().then(() => {
              res.redirect(`/dashboard/application/${hostelId}/warden`);
            });
          }
        }
      );
    } else {
      res.redirect("/dashboard");
    }
  }
});

router.get("/:role/history", middleware.isLoggedIn, (req, res) => {
  Application.find(
    {
      adminId: req.user._id,
      role: req.params.role
    },
    (err, allApplications) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(allApplications);
        res.render("application/history", {
          currentUser: req.user,
          applications: allApplications
        });
      }
    }
  );
});

module.exports = router;
