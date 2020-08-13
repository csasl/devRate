const express = require("express"),
	  bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local");
	  

const app = express(),
	  //Require models
	  Condo = require("./models/condo"),
	  Comment= require("./models/comment"),
	  User = require("./models/user");

//Require routes
const  indexRoutes = require("./routes/index"),
	  condoRoutes = require("./routes/condo"),
	  commentRoutes = require("./routes/comment");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/devrate', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


//Mongoose set up
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/devrate").then(()=>{
// 	console.log("DB started");
// }).catch(err =>{
// 	console.log("ERROR", err.message);
// });


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

app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use("/condos", condoRoutes);
app.use(commentRoutes);
//app.use("/condos/:id/comments", commentRoutes);


var port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log("Server Has Started!");
    });