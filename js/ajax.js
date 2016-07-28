function loadPage (loc) {
  if (loc == '') {
    $.get('http://localhost:3000/pages/homepage.html', function (data, status) {
      $("#content").html(data);
    });
  } else {
    $.get('http://localhost:3000/pages/' + loc + '.html', function (data, status) {
      $("#content").html(data);
    });
  }
}

$(document).on('click', '.content-link', function () {
  var loc = $(this).attr('href').substring(3);
  loadPage(loc);
});

function handleLoad () {
  var loc = window.location.hash.substring(2);
  loadPage(loc)
}
