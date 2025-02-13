var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
    rating: {
      
        type: Number,
		
        required: ["true", "Please provide a rating of 1-5 stars"],
        min: 1,
        max: 5,
        validate: {
            // validator accepts a function definition which it uses for validation
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value."
        }
    },
    // review text
    text: {
        type: String
    },
    // author id and username fields
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // campground associated with the review
    condo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Condo"
    }
}, {
    // if timestamps are set to true, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);