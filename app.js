var express = require('express');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/quickl');
var postSchema = new mongoose.Schema({
  slug: String,
  title: String,
  content: String
});
var Post = mongoose.model('Post', postSchema);

var app = express();
var port = 3000;

app.set('view engine', 'pug');
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function (req, res) {
  res.render('index');
})

app.get('/pages/homepage', function (req, res) {
  res.send({"content": "<a href='/#/first-post' class='content-link'>The First Quickl Post</a><br><a href='/#/another-cool-post' class='content-link'>Another Cool Post</a>"});
});

app.get('/posts/:slug', function (req, res) {
  Post.findOne({'slug': req.params.slug}, function (err, post) {
    if (err) {
      throw err;
    }
    res.send(post);
  });
});

app.listen(port, function () {
  console.log('Quickl is listening on port ' + port)
});
