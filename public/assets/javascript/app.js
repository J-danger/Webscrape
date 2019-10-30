getUnsaved()

// Grab the articles as a json
function getUnsaved(){
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append( "<h2> " + data[i].title + "</h2> " + "<br />" + "<img src='" +  data[i].img + "'</img>" + "<br />" + "<button><a id='articleLink' href=" + data[i].link + "  target='_blank'>" + "Link" + "</a></button>"+"<button data-id='" + data[i]._id + "' id='saveArticle'>" + "Save" + "</button>" + "</p>" + "</div>"  + "</div>" );
  }
});
}

// "<p data-id='" + data[i]._id + "'>" + 
function getSaved(){
  // Grab the articles as a json
  $.getJSON("/articles/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append( "<div class='d-flex justify-content-around'>" + "<div id='article-container'>" +"<p data-id='" + data[i]._id + "'>" + "<h2> " + data[i].title + "</h2> " + "<br />" + "<img src='" +  data[i].img + "'</img>" + "<br />" + "<button><a id='articleLink' href=" + data[i].link + "  target='_blank'>" + "Link" + "</a></button>"+"<button id='saveArticle'>" + "Save" + "</button>" + "</p>" + "</div>"  + "</div>" );
    }
  });
  }


  $("#newScrape").on("click", function() { 
    $.ajax({
        method: "GET",
        url: "/scrape"
      }).then(function(data) {
        console.log(data)
        getUnsaved()
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




