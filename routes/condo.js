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
router.get("/new", isLoggedIn, (req, res)=>{
	res.render("condos/new");
});

//NEW
router.post("/", isLoggedIn, (req, res)=>{
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
	Condo.findById(req.params.id).populate("comments").exec((err, foundCondo) =>{
		if(err){
			res.redirect("/condos");
		} else {
			res.render("condos/show", {condo: foundCondo});
		}
	});
});

//midlleware- check if logged findById
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect("/login");
	}
}

module.exports = router;