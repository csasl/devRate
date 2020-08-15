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
			req.flash("error", err.message);
			return res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, ()=>{
				req.flash("success", "Welcome " + user.username + "!");
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
	req.flash("success", "Logged you out");
	res.redirect("/condos");
});

module.exports = router;
