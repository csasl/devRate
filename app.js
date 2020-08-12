const express = require("express"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local");
	  

const app = express(),
	  //Require models
	  Condo = require("./models/condo"),
	  Comment= require("./models/comment"),
	  User = require("./models/user"),
	  //Require routes
	  indexRoutes = require("./routes/index"),
	  condoRoutes = require("./routes/condo"),
	  commentRoutes = require("./routes/comment");

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(indexRoutes);
app.use("/condos", condoRoutes);
app.use(commentRoutes);
//app.use("/condos/:id/comments", commentRoutes);

//Mongoose set up
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/devrate").then(()=>{
	console.log("DB started");
}).catch(err =>{
	console.log("ERROR", err.message);
});

//Passport configuration
app.use(require("express-session") ({
		secret: "Vancouver is awesome",
		resave: false,
		saveUninitialized: false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res)=>{
	res.locals.currentUser = req.user;
	next();
});


var port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log("Server Has Started!");
    });