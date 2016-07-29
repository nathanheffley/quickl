$(document).on('click', '.content-link', function () {
  var uri = $(this).attr('href').substring(3);
  loadData(uri);
});

function loadData (loc) {
  if (loc == '') {
    $.get('http://localhost:3000/pages/homepage', function (data, status) {
      loadPage(data);
    });
  } else {
    $.get('http://localhost:3000/posts/' + loc, function (data, status) {
      loadPage(data);
    });
  }
}

function loadPage (data) {
  var page = "";
  if (data.title) {
    page += "<h1>" + data.title + "</h1>";
  }
  if (data.content) {
    page += data.content;
  }
  $("#content").html(page);
}
