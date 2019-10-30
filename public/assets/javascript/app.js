getAll()

// Grab the articles as a json
function getAll(){
$.getJSON("/articles", function(data) {
  $("#articles").empty()
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append( "<h2> " + data[i].title + "</h2> " + "<br />" + "<img src='" +  data[i].img + "'</img>" + "<br />" + "<button><a id='articleLink' href=" + data[i].link + "  target='_blank'>" + "Link" + "</a></button>"+"<button data-id='" + data[i]._id + "' id='saveArticle'>" + "Save" + "</button>" + "</p>" + "</div>"  + "</div>" );
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

  




