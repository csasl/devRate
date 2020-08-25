const express = require("express"),
	  router = express.Router(),
	  Condo = require("../models/condo"),
	  Review = require("../models/review"),
	  middleware = require("../middleware");

//Index route- to show all from most recent to least recent
router.get("/condos/:id/reviews", (req, res)=>{
	Condo.findById(req.params.id).populate({
		path: "reviews",
		options: {sort: {createdAt: -1}}
	}).exec((err, condo)=>{
		if(err || !condo){
			req.flash("error", "Condo not found");
			return res.redirect("back");
		}
		res.render("reviews/index", {condo: condo});
	});
});

// Reviews New
router.get("/condos/:id/reviews/new", middleware.isLoggedIn, middleware.checkReviewExistence, (req, res)=> {
  
    Condo.findById(req.params.id, function (err, condo) {
        if (err) {
            req.flash("error", "Condo not found");
            return res.redirect("back");
        }
        res.render("reviews/new", {condo: condo});

    });
});

// Reviews Create
router.post("/condos/:id/reviews", middleware.isLoggedIn, middleware.checkReviewExistence, (req, res)=> {
    Condo.findById(req.params.id).populate("reviews").exec((err, condo)=> {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review,  (err, review)=> {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.campground = condo;
            //save review
            review.save();
            condo.reviews.push(review);
            // calculate the new average review for the campground
            condo.rating = calculateAverage(condo.reviews);
            //save campground
            condo.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/condos/' + condo._id);
        });
    });
});

// Reviews Edit
router.get("/condos/:id/reviews/:review_id/edit", middleware.checkReviewOwnership, (req, res)=> {
    Review.findById(req.params.review_id, (err, foundReview)=> {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit", {condo_id: req.params.id, review: foundReview});
    });
});

// Reviews Update
router.put("/condos/:id/reviews/:review_id", middleware.checkReviewOwnership, (req, res)=> {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, (err, updatedReview)=> {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Condo.findById(req.params.id).populate("reviews").exec( (err, condo)=> {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate campground average
            condo.rating = calculateAverage(condo.reviews);
            //save changes
            condo.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/campgrounds/' + condo._id);
        });
    });
});

//Delete route
router.delete("/condos/:id/reviews/:review_id", middleware.checkReviewOwnership, (req, res)=>{
	Review.findByIdAndRemove(req.params.review_id, (err)=>{
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		} else {
			Condo.findById(req.params.id, (err, condo)=>{
				if(err){
					req.flash("error", "Condo not found");
					res.redirect("back");
				} else{
					condo.rating = calculateAverage(condo.reviews);
					condo.save();
					req.flash("success", "Your review was deleted");
					res.redirect("/condos/" + req.params.id);
				}
			});
		}
	});
});

//Calculates average rating
function calculateAverage(reviews){
	if(reviews.length == 0){
		return 0;
	}
	let sum = 0;
	reviews.forEach((review)=>{
		sum = sum + review.rating;
	});
	return sum/reviews.length;
}

module.exports = router;