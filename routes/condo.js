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

const multer = require('multer');
let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dtif5dxfv', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
router.post("/", middleware.isLoggedIn,  upload.single('image'),    (req, res)=>{
	 cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      	if(err) {
        	req.flash('error', err.message);
        	return res.redirect('back');
     	 }
		let name = req.body.name,
		 	developer = req.body.developer,
		 	rent = req.body.rent,
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
					let image = result.secure_url;
					let imageId = result.public_id;
					newCondo = {name: name, developer:developer, location: location, amenities:amenities, lat: lat, lng: lng, postalCode: postalCode, rent: rent, image:image, imageId: imageId, author:author, petFriendly:petFriendly};
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
router.put("/:id", middleware.checkCondoOwnership, upload.single('image'), (req, res)=>{
	Condo.findById(req.params.id, async function(err, condo) {
		if(err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			if(req.file) {
				try{
					await cloudinary.v2.uploader.destroy(condo.imageId);
					let result = await cloudinary.v2.uploader.upload(req.file.path);
					condo.image = result.secure_url;
					condo.imageId = result.public_id;
				} catch(err){
					req.flash(err, err.message);
					console.log("the field is " + err.field);
					return res.redirect("back");
				}
			}
			if(req.body.condo.postalCode !== condo.postalCode) {
				try{
					let updatedLocation = await geocoder.geocode(req.body.condo.postalCode);
					condo.lat = updatedLocation[0].latitude;
					condo.lng = updatedLocation[0].longitude;
					condo.postalCode = updatedLocation[0].zipcode;
					
				} catch(err) {
					req.flash("error", err.message);
					return res.redirect("back");
				}
			}
			condo.name = req.body.condo.name;
			condo.developer = req.body.condo.developer;
			condo.rent = req.body.condo.rent;
			condo.location = req.body.condo.location;
			condo.petFriendly = req.body.condo.petFriendly;
			condo.amenities = Array.isArray(req.body.condo.amenities) ? req.body.condo.amenities : [req.body.condo.amenities]
			condo.save();
			req.flash("success", "Succesfully updated your entry");
			res.redirect("/condos/"+condo._id);
			
		}
	});
	
});

	// geocoder.geocode(req.body.condo.postalCode, (err, data)=>{
	// 	if(err || !data.length){
	// 		console.log(err);
	// 		req.flash("error", "Invalid address");
	// 		return res.redirect("back");
	// 	} else {
	// 		req.body.condo.lat= data[0].latitude;
	// 		req.body.condo.lng= data[0].longitude;
	// 		req.body.condo.postalCode= data[0].zipcode;
	// 		delete req.body.condo.rating;
	// 		Condo.findByIdAndUpdate(req.params.id, req.body.condo, {new: true}, (err, updatedCondo)=>{
	// 		if(err){
	// 			res.redirect("back");
	// 		} else {
	// 				res.redirect("/condos/"+updatedCondo._id);
	// 			}
	// 		});
	// 	}
	// });

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