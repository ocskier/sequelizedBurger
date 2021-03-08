require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 8080;

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

var db = require("./models");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.(
require("./controllers/burgersController.js")(app);

// Start our server so that it can begin listening to client requests.

db.sequelize.sync().then(() => {
  app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
})


// https://intense-wildwood-45271.herokuapp.com/