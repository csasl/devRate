const express = require("express"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");

const app = express(),
	  //Require models
	  Condo = require("./models/condo"),
	  Comment= require("./models/comment"),
	  //Require routes
	  indexRoutes = require("./routes/index"),
	  condoRoutes = require("./routes/condo"),
	  commentRoutes = require("./routes/comment");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(indexRoutes);
app.use("/condos", condoRoutes);
app.use(commentRoutes);
//app.use("/condos/:id/comments", commentRoutes);

//Mongoose set up
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/devrate").then(()=>{
	console.log("DB started");
}).catch(err =>{
	console.log("ERROR", err.message);
});




var port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log("Server Has Started!");
    });