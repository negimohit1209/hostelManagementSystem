var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var passport = require("passport");
var User = require("../models/user");
var Hostel = require("../models/hostel");
var Application = require("../models/application");
var Bill = require("../models/bill");

router.get("/", middleware.isLoggedIn, (req, res) => {
  res.render("bill/billform", { currentUser: req.user });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  var bill = {};
  if (req.body.amount && req.body.name && req.body.duedate) {
    bill.amount = req.body.amount;
    bill.name = req.body.name;
    bill.duedate = req.body.duedate;
  } else {
    res.redirect("/dashboard/bill");
  }
  bill.wardenId = req.user._id;
  bill.timestamp = new Date().getTime();
  User.find(
    {
      role: "student",
      hostel: {
        id: req.user.hostel.id,
        name: req.user.hostel.name
      }
    },
    (err, users) => {
      users.forEach(user => {
        bill.boarderId = user._id;
        bill.avatar = user.avatar;
        Bill.create(bill, (err, bill) => {
          if (err) {
            console.log(err);
          } else {
          }
        });
      });
      res.redirect("/dashboard/bill/details");
    }
  );
});

router.get("/details", middleware.isLoggedIn, (req, res) => {
  var billDetails = [];
  Bill.find(
    {
      wardenId: req.user._id
    },
    (err, bills) => {
      if (err) {
        console.log(err);
      } else {
        res.render("bill/billdetails", { currentUser: req.user, bills: bills });
      }
    }
  );
  // res.render("bill/billdetails", {currentUser: req.body.user, })
});

router.get("/:userid", middleware.isLoggedIn, (req, res) => {
  Bill.find(
    {
      boarderId: req.params.userid,
      paid: 0
    },
    (err, bills) => {
      if (err) {
        console.log(err);
      } else {
        console.log(bills);
        res.render("bill/userbills", { currentUser: req.user, bills: bills });
      }
    }
  );
  // res.render("bill/billdetails", {currentUser: req.body.user, })
});

router.get("/fine/:userid", middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.userid, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.render("bill/fineform", { currentUser: req.user, user: user });
    }
  });
});

router.post("/fine/:userid", middleware.isLoggedIn, (req, res) => {
  console.log("yup");
  var boarderId = req.params.userid;
  var bill = {};
  if (req.body.amount && req.body.name && req.body.duedate) {
    bill.amount = req.body.amount;
    bill.name = req.body.name;
    bill.duedate = req.body.duedate;
  } else {
    res.redirect("/dashboard/bill");
  }
  bill.wardenId = req.user._id;
  bill.timestamp = new Date().getTime();
  console.log(bill);
  User.findById(boarderId, (err, user) => {
    bill.boarderId = user._id;
    bill.avatar = user.avatar;
    console.log(bill);
    Bill.create(bill, (err, bill) => {
      if (err) {
        console.log(err);
      } else {
      }
    });
    res.redirect("/dashboard/bill/details");
  });
});

router.post("/:userid/:billid", middleware.isLoggedIn, (req, res) => {
  var userId = req.params.userid;
  var billId = req.params.billid;
  Bill.findById(billId, (err, bill) => {
    if (err) {
      console.log(err);
    } else {
      bill.paid = 1;
      bill.paidtime = new Date().getTime();
      bill.save().then(() => {
        res.redirect(`/dashboard/bill/${userId}/history`);
      });
    }
  });
});

router.get("/:userid/history", middleware.isLoggedIn, (req, res) => {
  Bill.find(
    {
      boarderId: req.params.userid,
      paid: 1
    },
    (err, bills) => {
      if (err) {
        console.log(err);
      } else {
        res.render("bill/billdetails", { currentUser: req.user, bills: bills });
      }
    }
  );
});

module.exports = router;
