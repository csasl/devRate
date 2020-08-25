const Condo = require("../models/condo"),
	  Comment = require("../models/comment"),
	  Review = require("../modles/review");

const middleWareObj = {};

middleWareObj.checkCondoOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Condo.findById(req.params.id, (err, foundCondo)=>{
			if(err || !foundCondo){
				req.flash("error", "Condo not found!");
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
			if(err || !foundComment){
				req.flash("error", "Comment not found");
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

middleWareObj.checkReviewExistence = function (req, res, next){
	if(req.isAuthenticated()){
		Condo.findById(req.params.id).populate("reviews").exec((err, condo)=>{
			if(err || !condo){
				req.flash("error", "Condo not found");
				req.redirect("back");
			} else {
				const foundUserReview = condo.reviews.some((review)=>{
					return review.author.id.equals(req.user._id);
				});
				
				if(foundUserReview){
					req.flash("error", "You have already reviewed this condo. Please edit your review to make any changes");
				} else {
					next();
				}
			}
		});
	} else {
		req.flash("error", "You need to log in first");
		res.redirect("/login");
	}
}

middleWareObj.checkReviewOwnership = function (req, res, next) {
	if(req.isAuthenticated()){
		Review.findById(req.params.review_id, (err, foundReview)=>{
			if(err || !foundReview){
				req.flash("error", "Review not found");
				res.redirect("back");
			} else {
				if(foundReview.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

module.exports = middleWareObj;