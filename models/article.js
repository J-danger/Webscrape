
var mongoose = require("mongoose");


var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  title: {
    type: String,
    required: false,	
    unique: true
  },
 
  link: {
    type: String,
    required: false,
    unique: true
  },
  img: {
    type: String,
    required: false,
    unique: true
  }, 
  summary: {
    type: String,
    required: false
  },
  time: {
    type: String,
    required: false
  },
  author: {
    type: String,
    required: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }, 
  saved: {
    type: Boolean,
    default: false
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;











