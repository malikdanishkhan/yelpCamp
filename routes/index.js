var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
   res.render("landing"); 
});

// --------------
// AUTH ROUTES
// --------------

// show register form
router.get("/register", function(req, res){
   res.render("register");
});

// registeration logic
router.post("/register", function(req, res){
   
   var newUser = new User({username: req.body.username});
   var newUserPassword = req.body.password;
   
   User.register(newUser, newUserPassword, function(error, newUser){
      if(error){
         req.flash("error", error.message);
         return res.render("register");
      }
      passport.authenticate("local")(req, res, function(){
         req.flash("success", "Welcome to YelpCamp "+ newUser.username);
         res.redirect("/campgrounds");
      });
   });
});

//show login form
router.get("/login", function(req, res){
   res.render("login");
});

// login logic
router.post("/login", passport.authenticate("local", 
   {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
   }) ,function(req, res){
   res.send("login logic goes here");
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out.");
   res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   req.flash("error", "You need to be logged in to do that.");
   res.redirect("/login");
}

module.exports = router;