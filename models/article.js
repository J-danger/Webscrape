
var mongoose = require("mongoose");


var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true,	
    unique: true
  },
 
  link: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: String,
    required: true,
    unique: true
  }, 
  summary: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }, 
  saved: {
    type: Boolean,
    default: true
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;











