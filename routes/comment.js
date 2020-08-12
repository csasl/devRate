const express = require("express"),
	  router = express.Router(),
	  Condo = require("../models/condo"),
	  Comment = require("../models/comment");

//NEW COMMENT
router.get("/condos/:id/comments/new", isLoggedIn, (req,res)=>{
	console.log(req.params.id);
	Condo.findById(req.params.id, (err, condo)=>{
		if(err){
			res.redirect("/condos");
		} else {
			res.render("comments/new", {condo: condo});
		}
	})
});

//CREATE COMMENT
router.post("/condos/:id/comments", isLoggedIn, (req, res)=>{
	Condo.findById(req.params.id, (err, foundCondo)=>{
		if(err){
			console.log(err);
			res.redirect("/condos");
		} else {
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					//ADD FLASH HERE
					console.log(err);
					res.redirect("/condos");
				} else {
					comment.save();
					foundCondo.comments.push(comment);
					foundCondo.save();
					//ADD FLASH HERE
					res.redirect("/condos/" + foundCondo._id);
				}
			})
		}
	});
})
//midlleware- check if logged findById
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	}
}

module.exports = router;

