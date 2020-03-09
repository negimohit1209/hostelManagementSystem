const express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var methodOverride = require("method-override");
var localStrategy = require("passport-local");
var flash = require("connect-flash");
var moment = require("moment");

const app = express();
const port = process.env.PORT || 3000;
var { mongoose } = require("./config/mongoose");
var User = require("./models/user");

// ROUTES DECLARATION
const indexRoutes = require("./routes/index");
const dashboardRoutes = require("./routes/dashboard");
const applicationRoutes = require("./routes/application");
const billRoutes = require("./routes/bill");

// additional configuration

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

//configuring passport
app.use(
  require("express-session")({
    secret: "this will be used for the hash function",
    resave: false,
    saveUninitialized: false
  })
);

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  app.locals.moment = require("moment");
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/dashboard/application", applicationRoutes);
app.use("/dashboard/bill", billRoutes);

app.get("/", (req, res) => {
  res.render("landing");
});

app.listen(port, () => console.log(`app is running on port ${port}`));
