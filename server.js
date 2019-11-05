// DEPENDENCIES
require("dotenv").config();
let express = require("express");
let exphbs = require("express-handlebars");
let mongoose = require("mongoose");

// EXPRESS-MONGO CONFIG
let PORT = process.env.PORT || 3000;
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";
let app = express();

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// HANDLEBARS
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      ifEquals: function(arg1, arg2, options) {
        return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
      }
    }
  })
);
app.set("view engine", "handlebars");

// MONGO DB CONNECTION
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// ROUTES
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// STARTING THE SERVER
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});