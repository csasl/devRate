const express = require("express"),
	  router = express.Router(),
	  Condo = require("../models/condo"),
	  middleware = require("../middleware/index");


//INDEX
router.get("/", (req, res)=>{
	Condo.find({}, (err, allCondos)=>{
		if(err){
			console.log(err);
		} else {
			res.render("condos/index", {condos: allCondos});
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
		  address = req.body.address,
		  postalCode = req.body.postalCode,
		  rent = req.body.rent,
		  image = req.body.image,
		  author = {
			  id: req.user._id,
			  username: req.user.username
		  },
		  newCondo = {name: name, developer:developer, address: address, postalCode: postalCode, rent: rent, image:image, author:author};
	//save condo to db
	Condo.create(newCondo, (err, c)=>{
		if(err){
			console.log("ERROR");
		} else {
			res.redirect("/condos");
		}
	})
});

//SHOW
router.get("/:id", (req, res)=>{
	Condo.findById(req.params.id).populate("comments").exec((err, foundCondo) =>{
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
	Condo.findByIdAndUpdate(req.params.id, req.body.condo, {new: true}, (err, updatedCondo)=>{
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/condos/"+updatedCondo._id);
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