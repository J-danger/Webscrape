getAll()

// Grab the articles as a json
function getAll(){
$.getJSON("/articles", function(data) {
  $("#articles").empty()
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append( "<h2> " + data[i].title + "</h2> " + "<br />" + "<img src='" +  data[i].img + "'</img>" + "<br />" + "<button><a id='articleLink' href=" + data[i].link + "  target='_blank'>" + "Link" + "</a></button>"+"<button data-id='" + data[i]._id + "' id='saveArticle'>" + "Save" + "</button>" + "<button data-id='" + data[i]._id + "' id='addNote'>" + "Add Note" + "</button>" + "</div>"  + "</div>" );
  }
});
}

function getSaved(){
  // Grab the articles as a json
  $.getJSON("/saved", function(data) {
    $("#articles").empty()
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append( "<h2> " + data[i].title + "</h2> " + "<br />" + "<img src='" +  data[i].img + "'</img>" + "<br />" + "<button><a id='articleLink' href=" + data[i].link + "  target='_blank'>" + "Link" + "</a></button>"+"<button data-id='" + data[i]._id + "' id='saveArticle'>" + "Save" + "</button>" + "</p>" + "</div>"  + "</div>" );
    }
  });
  }

  $("#saved").on("click", function() { 
    $.ajax({
        method: "GET",
        url: "/saved"
      }).then(function(data) {
        console.log(data)
        getSaved()
      })
    })


  $("#newScrape").on("click", function() { 
    $.ajax({
        method: "GET",
        url: "/scrape"
      }).then(function(data) {
        console.log(data)
        getAll()
      })
    })

    $("#clearScrape").on("click", function() {  
      $.ajax({
      method: "GET",
      url: "/delete"
    }).then(function(data){
      console.log(data)
      document.location.reload()
    })   
    
  })
  
  $(document).on("click", "#saveArticle", function() {
    var thisId = $(this).attr("data-id");
    console.log()
    $.ajax({
    method: "PUT",
    url: "/saved/" + thisId
  }).then(function(data){
    console.log(data)    
  })  
  });


  

// $(document).on("click", "#addNote", function() {
  $("#addNote").on("click", function(){
  
  $("#notes").empty();
 
  var thisId = $(this).attr("data-id");
 
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
   
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>Add a Note!</h2>");     
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

  




