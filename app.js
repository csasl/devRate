const express = require("express"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");

const app = express(),
	  Condo = require("./models/condo"),
	  indexRoutes = require("./routes/index"),
	  condoRoutes = require("./routes/condo");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(indexRoutes);
app.use("/condos", condoRoutes);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/devrate").then(()=>{
	console.log("DB started");
}).catch(err =>{
	console.log("ERROR", err.message);
});



// Condo.create({
// 	name: "Test",
// 	developer: "Test",
// 	image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1692&q=80",
// 	rent: "1000"
// }, (err, condo) =>{
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(condo);
// 	}
// });



var port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log("Server Has Started!");
    });