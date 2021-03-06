require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var passport = require("passport");
var session = require("express-session");
var db = require("./models");
// var formidable = require("formidable"),
//   http = require("http"),
//   util = require("util");
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// For Passport
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//Models
var models = require("./models");

//Sync Database
models.sequelize
  .sync()
  .then(function() {
    console.log("Nice data, bro!");
  })
  .catch(function(err) {
    console.log(err, "Dang. It broke.");
  });

// Routes
require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);
require("./routes/auth.js")(app, passport);

//load passport strategies
require("./config/passport/passport.js")(passport, db.user);

var syncOptions = { force: false };

// app.get("/", function(req, res) {
//   res.send("Welcome to Passport with Sequelize");
// });

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
