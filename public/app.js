function displayResults(animals) {
    // First, empty the table
    $("tbody").empty();
  
    // Then, for each entry of that json...
    animals.forEach(function(animal) {
      // Append each of the animal's properties to the table
      var tr = $("<tr>").append(
        $("<td>").text(animal.name),
        $("<td>").text(animal.numLegs),
        $("<td>").text(animal.class),
        $("<td>").text(animal.weight),
        $("<td>").text(animal.whatIWouldReallyCallIt)
      );
  
      $("tbody").append(tr);
    });
  }