const express = require("express"),
	  router = express.Router(),
	  Condo = require("../models/condo"),
	  Comment = require("../models/comment"),
	  Review = require("../models/review"),
	  middleware = require("../middleware/index"),
	  NodeGeocoder = require("node-geocoder");

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
const geocoder = NodeGeocoder(options);

//INDEX
router.get("/", (req, res)=>{
	Condo.find({}, (err, allCondos)=>{
		if(err){
			console.log(err);
		} else {
			res.render("condos/index", {condos: allCondos, page:'condos'});
		}
	});
});

//CREATE
router.get("/new", middleware.isLoggedIn, (req, res)=>{
	res.render("condos/new");
});

//NEW
router.post("/", middleware.isLoggedIn, (req, res)=>{
	let name = req.body.name,
		  developer = req.body.developer,
		  rent = req.body.rent,
		  image = req.body.image,
		  location = req.body.location,
		  author = {
			  id: req.user._id,
			  username: req.user.username
		  },
		amenities = Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities],
		petFriendly = req.body.petFriendly;
		
		geocoder.geocode(req.body.postalCode, (err, data)=>{
			if(err || !data.length) {
				console.log(err);
				req.flash("error", "Invalid postal code");
				return res.redirect("back");
				
			} else {
				let lat = data[0].latitude;
   				let lng = data[0].longitude;
				let postalCode = data[0].zipcode;
				newCondo = {name: name, developer:developer, location: location, amenities:amenities, lat: lat, lng: lng, postalCode: postalCode, rent: rent, image:image, author:author, petFriendly:petFriendly};
			//save condo to db
				Condo.create(newCondo, (err, c)=>{
					if(err){
						console.log(err.message);
					} else {
						res.redirect("/condos/" + c._id);
					}
					});
				}
			
		});
	});
	

//SHOW
router.get("/:id", (req, res)=>{
	Condo.findById(req.params.id).populate("comments").populate({
		path: "reviews",
		options:{sort: {createdAt: -1}}
	}).exec((err, foundCondo) =>{
		if(err || !foundCondo){
			req.flash("error", "Condo not found!");
			res.redirect("back");
		} else {
			res.render("condos/show", {condo: foundCondo});
		}
	});
});

//EDIT CONDO ROUTE
router.get("/:id/edit", middleware.checkCondoOwnership, (req, res)=>{
	Condo.findById(req.params.id, (err, foundCondo)=>{ //Don't expect any error since this would have been detected by middleware
		res.render("condos/edit", {condo: foundCondo});
	});
});

//UPDATE CONDO ROUTE
router.put("/:id", middleware.checkCondoOwnership, (req, res)=>{
	geocoder.geocode(req.body.condo.postalCode, (err, data)=>{
		if(err || !data.length){
			console.log(err);
			req.flash("error", "Invalid address");
			return res.redirect("back");
		} else {
			req.body.condo.lat= data[0].latitude;
			req.body.condo.lng= data[0].longitude;
			req.body.condo.postalCode= data[0].zipcode;
			delete req.body.condo.rating;
			Condo.findByIdAndUpdate(req.params.id, req.body.condo, {new: true}, (err, updatedCondo)=>{
			if(err){
				res.redirect("back");
			} else {
					res.redirect("/condos/"+updatedCondo._id);
				}
			});
		}
	});
	
});

//DELETE CONDO ROUTE
router.delete("/:id", middleware.checkCondoOwnership, (req, res)=>{
	Condo.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect("/condos");
		} else {
			
			res.redirect("/condos");
		}
	});
} );



module.exports = router;