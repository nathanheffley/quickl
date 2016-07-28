$(document).on('click', '.content-link', function () {
  var loc = $(this).attr('href').substring(2);
  $.get('http://localhost:3000/pages/' + loc + '.html', function (data, status) {
    $("#content").html(data);
  });
});
