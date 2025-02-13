const mongoose = require("mongoose");

const condoSchema = new mongoose.Schema({
	name: String,
	developer: String,
	location: String,
	lat: Number,
	lng: Number,
	postalCode: String,
	image: String,
	imageId: String,
	rent: Number,
	amenities: {
		type: [{type: String, enum: ["none", "pool", "gym", "retail", "concierge", "bike-locker", "rooftop"]}],
		default: "none"
	},
	petFriendly: Boolean,
	createdAt: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	
	comments: [ 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	],
	rating: {
		type: Number,
		default: 0
	}


});

module.exports = mongoose.model("Condo", condoSchema);