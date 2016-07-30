var express = require('express');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/quickl');
var postSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true},
  title: { type: String, required: true},
  content: { type: String, required: true}
});
var Post = mongoose.model('Post', postSchema);

var app = express();
var port = 3000;

app.set('view engine', 'pug');
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/amp', function (req, res) {
  res.render('amp/index');
});

app.get('/:slug', function (req, res) {
  Post.findOne({'slug': req.params.slug}, function (err, post) {
    if (err) {
      console.log(err);
    } else if (post) {
      res.render('post', {postTitle: post.title, postContent: post.content});
    } else {
      res.render('post', {postTitle: 'Post not found.', postContent: '<p>Sorry that I couldn\'t find what you\'re looking for :(</p>'});
    }
  });
});

app.get('/:slug/amp', function (req, res) {
  Post.findOne({'slug': req.params.slug}, function (err, post) {
    if (err) {
      console.log(err);
    } else if (post) {
      res.render('amp/post', {postTitle: post.title, postContent: post.content});
    } else {
      res.render('amp/post', {postTitle: 'Post not found.', postContent: '<p>Sorry that I couldn\'t find what you\'re looking for :(</p>'});
    }
  });
});

app.listen(port, function () {
  console.log('Quickl is listening on port ' + port)
});
