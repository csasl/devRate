const Condo = require("../models/condo"),
	  Comment = require("../models/comment");

const middleWareObj = {};

middleWareObj.checkCondoOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Condo.findById(req.params.id, (err, foundCondo)=>{
			if(err){
				res.redirect("back");
			} else {
				if(foundCondo.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
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
		res.redirect("/login");
	}
}

module.exports = middleWareObj;