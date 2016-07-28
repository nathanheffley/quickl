var express = require('express');
var app = express();
var port = 3000;

app.set('view engine', 'pug');
app.use('/pages', express.static(__dirname + '/pages'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(port, function () {
  console.log('Quickl is listening on port ' + port)
});
