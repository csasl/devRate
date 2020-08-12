const express = require ("express"),
	  router = express.Router(),
	  User = require("../models/user"),
	  passport = require("passport");


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
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			//ADD FLASH HERE
			return res.render("/register");
		} else {
			passport.authenticate("local")(req, res, ()=>{
				//ADD FLASH HERE
				res.redirect("/condos");
			});
		}
	});
});

//login page router
router.get("/login", (req,res)=>{
	res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/condos",
	failureRedirect: "/login"
	}), (req, res)=>{
	
});

//logout route
router.get("/logout", (req, res)=>{
	req.logout();
	//ADD FLASH HERE
	res.redirect("/condos");
});

module.exports = router;
