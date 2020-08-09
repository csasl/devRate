const express = require ("express"),
	  router = express.Router();

//home page route
router.get("/", (req, res)=>{
	res.send("reached home page");
});

//sign up page route
router.get("/register", (req, res)=>{
	res.send("reached sign up page");
});

//login page router
router.get("/login", (req,res)=>{
	res.send("reached login page");
});

//logout route
router.get("/logout", (req, res)=>{
	res.send("reached logout page");
});

module.exports = router;
