const mongoose = require("mongoose");

const condoSchema = new mongoose.Schema({
	name: String,
	developer: String,
	image: String,
	rent: String
});

module.exports = mongoose.model("Condo", condoSchema);