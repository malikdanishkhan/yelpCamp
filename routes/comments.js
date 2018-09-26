var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// --------------
// COMMENTS ROUTES
// --------------

// NEW - show form to add comments to a campground
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(error, campground){
      if(error){
         console.log(error);
      }else{
          res.render("comments/new", {campground: campground});
      }
   });
});

// POST - route to post comment
router.post("/campgrounds/:id/comments", isLoggedIn,function(req, res){
   Campground.findById(req.params.id, function(error, campground){
      if(error){
         console.log(error);
      } else {
         Comment.create(req.body.comment, function(error, comment){
            if(error){
               console.log(error);
            }else{
               console.log(req.user.username);
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               console.log(comment);
               req.flash("success", "Successfully added comment!");
               res.redirect('/campgrounds/' + campground._id);
            }
         });
      }
   });
});

// EDIT - route to comment form
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
   
   Campground.findById(req.params.id, function(error, foundCampground){
      if(error || !foundCampground){
         req.flash("error", "Campground not found.");
         return res.redirect("back");
      }
      Comment.findById(req.params.comment_id, function(error, foundComment){
         if(error){
            console.log("There was an error finding the comment");
         }else{
            console.log(foundComment._id);
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
         }
      });
   });
});

//EDIT - logic to edit comment
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
      if(error){
         console.log("There was an error updating the comment.");
      }else{
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// DELETE - route to delete comment
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(error){
      if(error){
         console.log("There was an error deleting the comment");
         res.redirect("back");
      }else{
         creq.flash("success", "Comment deleted.");
         res.redirect("/campgrounds/" + req.params.id);
      }
   })
});

//middleware
function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   req.flash("error", "You need to be logged in to do that.");
   res.redirect("/login");
}

//middleware to ensure only comment post owners can edit and delete it
function checkCommentOwnership(req, res, next){
      if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(error, foundComment){
         if(error || !foundComment){
            req.flash("error", "Comment not found.");
            res.redirect("back");
         }else{
            if(foundComment.author.id.equals(req.user._id)){
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
