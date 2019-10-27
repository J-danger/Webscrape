// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration
var databaseUrl = "scrape";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Making a request via axios for reddit's "webdev" board. We are sure to use old.reddit due to changes in HTML structure for the new reddit. The page's Response is passed as our promise argument.
axios.get("https://www.coindesk.com/").then(function(response) {

  // Load the Response into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $(".stream-article").each(function(i, element) {
    
    var title = $(element).attr("title")
    var link = $(element).attr("href");
    var img = $(element).children(".image").children("img").attr("src")   

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
      image: img
    });
  });
 
  db.scrapedData.insert(results)
  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});


app.get("/all", function(req, res) {
    // Query: In our database, go to the animals collection, then "find" everything
    db.scrapedData.find({}, function(err, data) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      else {
        // Otherwise, send the result of this query to the browser
        res.json(data);
      }
    });
  });

  app.get("/", function(req, res) {
    res.render("index.handlebars");
  });

  app.listen(3000, function() {
    console.log("App running on port 3000!");
  });