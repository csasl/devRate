const Condo = require("../models/condo"),
	  Comment = require("../models/comment");

const middleWareObj = {};

middleWareObj.checkCondoOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Condo.findById(req.params.id, (err, foundCondo)=>{
			if(err){
				req.flash("error", "Something went wrong, please try again later");
				res.redirect("back");
			} else {
				if(foundCondo.author.id.equals(req.user._id)) {
					next();
				} else {
					red.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middleWareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if(err){
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

middleWareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

module.exports = middleWareObj;