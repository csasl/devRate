require('dotenv').config();

const express = require("express"),
	  bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  flash = require("connect-flash");

	 
	  

const app = express(),
	  //Require models
	  Condo = require("./models/condo"),
	  Comment= require("./models/comment"),
	  User = require("./models/user");

//Require routes
const  indexRoutes = require("./routes/index"),
	  condoRoutes = require("./routes/condo"),
	  commentRoutes = require("./routes/comment"),
	  reviewRoutes = require("./routes/reviews");

const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/devrate', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex:true});
mongoose.connect('mongodb+srv://wdbyc:'+process.env.MONGO_ATLAS_PASSWORD+'@cluster0.5lz92.mongodb.net/<dbname>?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
}).then(()=>{
	console.log('connected to DB');
}).catch(err=>{
	console.log("err", err.message);
});
		 
		 
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
app.use(flash());

app.locals.moment = require('moment');

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/condos", condoRoutes);
app.use(commentRoutes);
app.use(reviewRoutes);


var port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log("Server Has Started!");
    });