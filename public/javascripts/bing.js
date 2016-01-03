
var search = function() {
  console.log("search");
  $.ajax({
    type: "POST",
    url: "/findimage",
    data: {'searchTerm': 'emergency-broadcast'}
  })
  .done(function(resp) {
    console.log("done");
    console.log(resp);
  })
  .fail(function() {
    console.log("error");
  });
}

$(document).ready(function() {
  $('.search').click(function () {
    search();
  });
});