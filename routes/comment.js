const express = require("express"),
	  router = express.Router(),
	  Condo = require("../models/condo"),
	  Comment = require("../models/comment");

//NEW COMMENT
router.get("/condos/:id/comments/new", (req,res)=>{
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
router.post("/condos/:id/comments", (req, res)=>{
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

module.exports = router;

