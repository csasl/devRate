const express = require ("express"),
	  router = express.Router(),
	  User = require("../models/user");


//home page route
router.get("/", (req, res)=>{
	res.render("landing");
});

//sign up page route
router.get("/register", (req, res)=>{
	res.render("register");
});

//handle signup logic
router.post("/register", (req, res)=>{
	let newUser = new User({username: req.body.username});
});

//login page router
router.get("/login", (req,res)=>{
	res.render("login");
});

//handle login logic
router.post("/login", (req,res)=>{
	res.redirect("/");
});


//logout route
router.get("/logout", (req, res)=>{
	res.send("reached logout page");
});

module.exports = router;
