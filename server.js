// Dependencies
const express = require("express");
// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger  = require("morgan");


// Initialize Express
const app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// // Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrape", { useNewUrlParser: true });

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Require all models
const db = require("./models/index");

const PORT = 3000;



// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  
  // First, we grab the body of the html with axios
  axios.get("https://www.coindesk.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
        
    $(".stream-article").each(function(i, element) {
     
      // Save an empty result object
      var result = {};     

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).attr("title");
      
      result.link = $(this).attr("href");
      
      result.img =  $(this).children(".image").children("img").attr("src");      
      
      
      // Create a new Article using the `result` object built from scraping
      
      db.Article.create(result)      
        .then(function(dbArticle) {
        
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find()
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});


  app.get("/", function(req, res) {
    res.render("index.handlebars");
  });

  app.listen(PORT, function() {
    console.log("App running on port 3000!");
  });

// // Mark a article as saved
// app.put("saved/:id", function(req, res) {
 
//   db.Article.update(
//     {
//       _id: mongojs.ObjectId(req.params.id)
//     },
//     {
//       // Set "read" to true for the book we specified
//       $push: {
//         saved: true
//       }
//     },
//     // When that's done, run this function
//     function(error, edited) {
//       // show any errors
//       if (error) {
//         console.log(error);
//         res.send(error);
//       }
//       else {
//         // Otherwise, send the result of our update to the browser
//         console.log(edited);
//         res.send(edited);
//       }
//     }
//   );
// });

// app.get("/delete", function(req, res){
//   db.Collections.drop("articles", function(err, data){
//   // Log any errors if the server encounters one
//   if (err) {
//     console.log(err);
//   }
//   else {
//     // Otherwise, send the result of this query to the browser
//     res.json(data);
//   }
//   })
// })

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });