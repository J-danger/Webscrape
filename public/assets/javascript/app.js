getAll()

// Grab the articles as a json
function getAll(){
$.getJSON("/articles", function(data) {
  $("#articles").empty()
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append( "<a href=" + data[i].link + "  target='_blank'><h2>" + data[i].title + "</h2></a> " + "<br />" + "<img src='" +  data[i].img + "'</img>" + "<br />" + "<br />" + "<p id='time'>" + data[i].time + " | " + data[i].author +  "</p>" + "<p>" + data[i].summary + "</p>" + "<button class='btn' data-id='" + data[i]._id + "' id='saveArticle'>" + "Save" + "</button>" + "<button class='btn' data-id='" + data[i]._id + "' id='addNote'>" + "Add/Edit Note" + "</button>" + "<button class='btn' data-id='" + data[i]._id + "' id='seeNote'>" + "My Notes" + "</button>" + "</div>"  + "</div>" + "<br />" + "<br />" );
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
      $("#articles").append( "<a href=" + data[i].link + "  target='_blank'><h2>" + data[i].title + "</h2></a> " + "<br />" + "<img src='" +  data[i].img + "'</img>" + "<br />" + "<br />" +"<button data-id='" + data[i]._id + "' id='unsaveArticle'>" + "Unsave" + "</button>" + "<button data-id='" + data[i]._id + "' id='addNote'>" + "Add/Edit Note" + "</button>" + "<button data-id='" + data[i]._id + "' id='seeNote'>" + "My Notes" + "</button>" + "</div>"  + "</div>" + "<br />" + "<br />" );
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
    $.ajax({
    method: "PUT",
    url: "/saved/" + thisId
  }).then(function(data){     
  })  
  });  

  $(document).on("click", "#unsaveArticle", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "PUT",
      url: "/articles/" + thisId
    }).then(function(data){ 
      console.log(data)    
    })  
    }); 


  $("#articles").on("click", "#addNote", function(){
  
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
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>" + "<br />");
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


// When you click the savenote button
$("#notes").on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: {           
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").hide();
    });

  // Also, remove the values entered in the input and textarea for note entry  
  $("#bodyinput").val("");
});

$("#articles").on("click", "#seeNote", function(){
  $("#notes").show();
  $("#notes").empty();

 
  var thisId = $(this).attr("data-id");
 
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
   
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h4> Notes for: " + "</h4>" + "<h5>" + data.title + "</h5>"  );         
      // A textarea to add a new note body
      $("#notes").append("<p>" + data.note.body + "<button data-id='" + data.note._id + "' id='deleteNote'>" + "DELETE" + "</button>" + "</p>");     
     
    });
});


function handleNoteDelete() {
  // This function handles the deletion of notes
  // First we grab the id of the note we want to delete
  // We stored this data on the delete button when we created it
  var thisId = $(this).attr("data-id");
  // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
  console.log(thisId)
  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId
  }).then(function() {
    $("#notes").hide();
  });
}

$(document).on("click", "#deleteNote", handleNoteDelete);

  




