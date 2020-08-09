const express = require("express"),
	  bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));


//Routes
const indexRoutes = require("./routes/index");

app.use(indexRoutes);

var port = process.env.PORT || 3000;
    app.listen(port, function () {
      console.log("Server Has Started!");
    });