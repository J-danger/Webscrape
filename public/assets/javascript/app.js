// Grab the articles as a json
$.getJSON("/all", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append( "<div class='d-flex justify-content-around'>" + "<div id='article-container'>" +"<p data-id='" + data[i]._id + "'>" + "<h2> " + data[i].title + "</h2> " + "<br />" + "<img src='" +  data[i].image + "'</img>" + "<br />" +  data[i].link + "</p>" + "</div>"  + "</div>" );
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



// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });