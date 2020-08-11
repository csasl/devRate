const mongoose = require("mongoose");

const condoSchema = new mongoose.Schema({
	name: String,
	developer: String,
	address: String,
	postalCode: String,
	image: String,
	rent: String,
	comments: [ 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]


});

module.exports = mongoose.model("Condo", condoSchema);