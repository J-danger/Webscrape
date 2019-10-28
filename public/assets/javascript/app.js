// Grab the articles as a json
$.getJSON("/all", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append( "<div class='d-flex justify-content-around'>" + "<div id='article-container'>" +"<p data-id='" + data[i]._id + "'>" + "<h2> " + data[i].title + "</h2> " + "<br />" + "<img src='" +  data[i].image + "'</img>" + "<br />" + "<button><a id='articleLink' href=" + data[i].link + "  target='_blank'>" + "Link" + "</a></button>"+"<button id='saveArticle'>" + "Save" + "</button>" + "</p>" + "</div>"  + "</div>" );
  }
});



$(document).on("click", "#newScrape", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data) {
    console.log(data)
    document.location.reload()
  })
})



$(document).on("click", "#clearScrape", function(){
  $.ajax({
    method: "GET",
    url: "/delete"
  }).then(function(data){
    console.log(data)
    document.location.reload()
  })
})


$(document).on("click", "#saveArticle", function(){
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/saved/:id" + thisId
  }).then(function(data){
    console.log(data)
    
  })
})


