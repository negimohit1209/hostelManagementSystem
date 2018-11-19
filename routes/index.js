var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get('/login', (req, res) =>{
    res.render("login");
});
router.post("/login", passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}));


router.get('/register', (req,res) => {
    res.render('register');
});

router.post("/register", function(req, res){
    var user = {};
    user.username = req.body.username;
    if(req.body.email.length !== 0){
        user.email = req.body.email
    }
    if(req.body.firstName.length !== 0){
        user.firstName = req.body.firstName
    }
    if(req.body.lastName.length !== 0){
        user.lastName = req.body.lastName
    }
    if(typeof(req.body.sex) !== 'undefined'){
        user.sex = req.body.sex
    }
    if(typeof(req.body.role) !== 'undefined'){
        user.role = req.body.role
    }
    if(req.body.dob.length !== 0){
        user.dob = req.body.dob
    }
    if(req.body.address.length !== 0){
        user.address = req.body.address
    }
    if(req.body.city.length !== 0){
        user.city = req.body.city
    }
    if(req.body.state.length !== 0){
        user.state = req.body.state
    }
    if(req.body.pincode.length !== 0){
        user.pincode = req.body.pincode
    }
    if(req.body.phoneno.length !== 0){
        user.phoneno = req.body.phoneno
    }
    if(req.body.areacode.length !== 0){
        user.areacode = req.body.areacode
    }
    if(req.body.college.length !== 0){
        user.college = req.body.college
    }
    if(req.body.department.length !== 0){
        user.department = req.body.department
    }
    if(req.body.semester.length !== 0){
        user.semester = req.body.semester
    }
    if(req.body.income.length !== 0){
        user.income = req.body.income
    }
    if(req.body.distance.length !== 0){
        user.distance = req.body.distance
    }
    if(req.body.avatar.length !== 0){
        user.avatar = req.body.avatar
    }
    if(req.body.cover.length !== 0){
        user.cover = req.body.cover
    }
    
    var newUser = new User(user);
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //lsconsole.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/dashboard");
        });
    });
});

router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/login");
});
module.exports = router;