const express = require("express"),
	  router = express.Router(),
	  Condo = require("../models/condo");

//SHOW
router.get("/", (req, res)=>{
	Condo.find({}, (err, allCondos)=>{
		if(err){
			console.log(err);
		} else {
			res.render("condos/index", {condos: allCondos});
		}
	});
});

module.exports = router;