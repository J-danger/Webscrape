// Dependencies
const express = require("express");
// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger  = require("morgan");
var mongojs = require("mongojs");

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

// remote db

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Require all models
const db = require("./models/index");


app.listen(process.env.PORT || 5000)


// renders html
app.get("/", function(req, res) {
  res.render("index.handlebars")
})



// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  
  // First, we grab the body of the html with axios
  axios.get("https://www.coindesk.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
        
    $("div.list-item-card").each(function(i, element) {
      //  console.log(element)
      // Save an empty result object
      var result = {};     

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element).children(".text-content").children("a").children(".heading").text()
      // "#__next > main > section > div:nth-child(2) > div > div > section.page-area-dotted-content > div > section > div:nth-child(2) > div > div.text-content > a:nth-child(2) > h4"
      
    
      result.link = $(element).children(".text-content").children("a:nth-child(2)").attr("href")
      
      result.img =  $(element).children(".media-content").children(".media-wrapper").children("a").children("picture").children("img").attr("src")     
 
      result.summary =  $(element).children(".text-content").children("a:nth-child(4)").children(".card-text").text()     
   
      result.time =  $(element).children(".text-content").children(".card-desc-block").children(".time").text();  
 
      result.author =  $(this).children(".text-content").children(".card-desc-block").children(".credit").children("a").text()
      
    //  "#__next > main > section > div:nth-child(2) > div > div > section.page-area-dotted-content > div > section > div:nth-child(2) > div > div.text-content > div > span > a"
      
      // Create a new Article using the `result` object built from scraping
      console.log(result)
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


// DO THIS BUT FOR THE NOTES

app.get("/delete", function(req, res){
  db.Article.remove({})  
  
  .then(function(dbArticle) {
     
    // If we were able to successfully find Articles, send them back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
     // Send a message to the client
     res.send("Clear Complete");
})

// Mark a article as saved
app.put("/saved/:id", function(req, res) {
 
  db.Article.updateOne(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      // Set "read" to true for the book we specified
      $set: {
        saved: true
      }
    },
    // When that's done, run this function
    function(error, edited) {
      // show any errors
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the result of our update to the browser
        console.log(edited);
        res.send(edited);
      }
      // Send a message to the client
     
    }
  );
});

// Mark an article not saved
app.put("/articles/:id", function(req, res) {
 
  db.Article.updateOne(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      // Set "read" to true for the book we specified
      $set: {
        saved: false
      }
    },
    // When that's done, run this function
    function(error, edited) {
      // show any errors
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the result of our update to the browser
        console.log(edited);
        res.send(edited);
      }
          
    }
  );
});

// Route for getting all Articles from the db
app.get("/saved", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({saved: true})
  .then(function(dbArticle) {
    
    // If we were able to successfully find Articles, send them back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

  // Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for grabbing a specifics saved Article by id
app.get("/saved/:id", function(req, res) {  
  db.Article.findOne({ _id: req.params.id })     
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


 // route for getting all notes
app.get("/notes", function(req, res) { 
  db.Note.find({})
    .then(function(dbNote) {     
      res.json(dbNote);
    })
    .catch(function(err) {     
      res.json(err);
    });
});


// Route for saving/updating an Article's associated Note
app.post("/notes/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
  .then(function(dbNote) {
    console.log("this one ", req.body)
    // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
      db.Note.remove({_id: req.params.id})
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});





