require("dotenv").config();

var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    flash            = require("connect-flash"),
    mongoose         = require("mongoose"),
    expressSession   = require("express-session"),
    methodOverride   = require("method-override"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    User             = require("./models/user"),
    seedDB           = require("./seeds");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

mongoose.connect("mongodb://danish:parrot1@ds115753.mlab.com:15753/yelpcamp_dm", { useNewUrlParser: true });

// seed DB
//seedDB();

// PASSPORT CONFIGURATION
app.use(expressSession({
   secret: "manifestation",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use will call the callback function on every single route
// it will send req.user (which is either undefined if no user is logged in)
// or defined if a user is logged in as well as req.flash("error")
// so every ejs template will have access top req.user (which is either undefined or defined)
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening"); 
});