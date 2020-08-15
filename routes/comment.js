const express = require("express"),
	  router = express.Router(),
	  Condo = require("../models/condo"),
	  Comment = require("../models/comment"),
	  middleware = require("../middleware/index");

//NEW COMMENT
router.get("/condos/:id/comments/new", middleware.isLoggedIn, (req,res)=>{
	Condo.findById(req.params.id, (err, condo)=>{
		if(err){
			res.redirect("/condos");
		} else {
			res.render("comments/new", {condo: condo});
		}
	})
});

//CREATE COMMENT
router.post("/condos/:id/comments", middleware.isLoggedIn, (req, res)=>{
	Condo.findById(req.params.id, (err, foundCondo)=>{
		if(err){
			console.log(err);
			res.redirect("/condos");
		} else {
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					req.flash("error", "Something went wrong, please try again later");
					res.redirect("/condos");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username,
					comment.save();
					foundCondo.comments.push(comment);
					foundCondo.save();
					req.flash("success", "Comment added!");
					res.redirect("/condos/" + foundCondo._id);
				}
			});
		}
	});
});

//EDIT ROUTE
router.get("/condos/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findById(req.params.comment_id, (err, foundComment)=>{
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {condo_id: req.params.id, comment:foundComment});
		}
	});
});

//COMMENT UPDATE ROUTE
router.put("/condos/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, {new: true}, (err, updatedComment)=>{
		if(err){
			res.redirect("back");
		} else {
			//ADD FLASH HERE
			res.redirect("/condos/" + req.params.id);
		}
	});
});

//COMMENT DESTROY ROUTE
router.delete("/condos/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){
			req.flash("error", "Something went wrong. Please try again later");
			res.redirect("/condos");
		} else {
			req.flash("success", "Comment removed");
			res.redirect("/condos/" + req.params.id);
		}
	});
});

module.exports = router;

