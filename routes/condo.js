const express = require("express"),
	  router = express.Router(),
	  Condo = require("../models/condo");

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
router.get("/new", (req, res)=>{
	res.render("condos/new");
});

//NEW
router.post("/", (req, res)=>{
	let name = req.body.name,
		  developer = req.body.developer,
		  address = req.body.address,
		  postalCode = req.body.postalCode,
		  rent = req.body.rent,
		  image = req.body.image,
		  newCondo = {name: name, developer:developer, address: address, postalCode: postalCode, rent: rent, image:image};
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
	Condo.findById(req.params.id, (err, foundCondo)=>{
		if(err){
			res.redirect("/condos");
		} else {
			res.render("condos/show", {condo: foundCondo});
		}
	});
});

module.exports = router;