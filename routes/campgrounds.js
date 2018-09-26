var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var NodeGeocoder = require("node-geocoder");

var options = {
 provider: 'google',
 httpAdapter: 'https',
 apiKey: process.env.GEOCODER_API_KEY,
 formatter: null
};

var geocoder = NodeGeocoder(options);

// --------------
// CAMPGROUND ROUTES
// --------------

// INDEX - shows all data from db
router.get("/campgrounds", function(req, res){
      
        Campground.find({}, function(error, allCampgrounds){
           if(error){
              console.log(error);
           }
           else{
              res.render("campgrounds/index", {campgrounds: allCampgrounds});
           }
        });
});

// CREATE - adds data to DB
router.post("/campgrounds", isLoggedIn, function(req, res){
  
   var name = req.body.name;
   var img = req.body.image;
   var price = req.body.price;
   var description = req.body.description;
   var author = {
      id: req.user._id,
      username: req.user.username
   };
   
   geocoder.geocode(req.body.location, function(error, data){
      if (error || !data.length) {
         req.flash("error", "Invalid address");
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      
      var newcampGround = {name: name, price: price, image: img, description: description, author: author, location: location, lat: lat, lng: lng};
   
      Campground.create(newcampGround, function(error, newlyCreated){
         if(error){
            console.log(error);
         }else{
         console.log(newlyCreated);
         res.redirect("/campgrounds");   
         }
      });
   });
});

// NEW - show for to add to DB
router.get("/campgrounds/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
   
   Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
      if(error || !foundCampground){
         req.flash("error", "Campground not found.");
         res.redirect("back");
         console.log(error);
      }else{
         console.log(foundCampground);
         res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});

// edit route
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
      Campground.findById(req.params.id, function(error, foundCampground){
               res.render("campgrounds/edit", {campground: foundCampground});
   });
});

// logic for update route
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
      geocoder.geocode(req.body.location, function(error, data){
      if (error || !data.length) {
         req.flash("error", "Invalid address");
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;

      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground){
         if(error){
            console.log(error);
         }else{
            console.log(updatedCampground);
            res.redirect("/campgrounds/"+ updatedCampground._id);
         }
      });
   });
});

//delete route
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(error){
      if(error){
         console.log(error);
      }else{
         console.log("Campground destroyed");
         res.redirect("/campgrounds");
      }
   });
});

//middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   req.flash("error", "You need to be logged in to do that.");
   res.redirect("/login");
}

//middleware to ensure only campground post owners can edit and delete it
function checkCampgroundOwnership(req, res, next){
      if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(error, foundCampground){
         if(error || !foundCampground){
            req.flash("error", "Campground not found.");
            res.redirect("back");
         }else{
            if(foundCampground.author.id.equals(req.user._id)){
               next();
            }
            else{
               req.flash("error", "Permission denied.");
               res.redirect("back");
            }
         }
      });
   }else{
      req.flash("error", "You need to be logged in to do that.");
      res.redirect("back");
   }
}

module.exports = router;