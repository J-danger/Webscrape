// $(document).ready(function() {

function displayResults(scrapedData) {
  // console.log("scrapedData", scrapedData)
    // First, empty the table
    $("tbody").empty();
  
    // Then, for each entry of that json...
    scrapedData.forEach(function(data) {
      // console.log("data", data.title)
      // console.log("link", data.link)
      // Append each of the animal's properties to the table
      var tr = $("<tr>").append(
        $("<td>").text(data.title),
        $("<td>").text(data.link),        
        
      );
      // console.log("tr", tr)
  
      $("tbody").append(tr);
    });
  }

  $.getJSON("/all", function(data) {
    //  console.log("data", data)
    // Call our function to generate a table body
    displayResults(data);
  });

// })

function createCard(article) {
  // This function takes in a single JSON object for an article/headline
  // It constructs a jQuery element containing all of the formatted HTML for the
  // article card
  var card = $("<div class='card'>");
  var cardHeader = $("<div class='card-header'>").append(
    $("<h3>").append(
      $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
        .attr("href", article.url)
        .text(article.headline),
      $("<a class='btn btn-success save'>Save Article</a>")
    )
  );

  var cardBody = $("<div class='card-body'>").text(article.summary);

  card.append(cardHeader, cardBody);
  // We attach the article's id to the jQuery element
  // We will use this when trying to figure out which article the user wants to save
  card.data("_id", article._id);
  // We return the constructed card jQuery element
  return card;
}
