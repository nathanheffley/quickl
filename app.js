var express = require('express');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/quickl');
var postSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true }
},
{ timestamps: true});
var Post = mongoose.model('Post', postSchema);

var app = express();
var port = 3000;

app.set('view engine', 'pug');
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function (req, res) {
  Post.find({}).limit(10).sort({ createdAt: -1 }).exec(function (err, posts) {
    if (err) throw err;
    res.render('index', { posts: posts });
  });
});

app.get('/amp', function (req, res) {
  Post.find({}).limit(10).sort({ createdAt: -1 }).exec(function (err, posts) {
    if (err) throw err;
    res.render(__dirname + '/amp/index', { posts: posts });
  });
});

app.get('/:slug', function (req, res) {
  Post.findOne({'slug': req.params.slug}, function (err, post) {
    if (err) {
      console.log(err);
    } else if (post) {
      res.render('post', {postSlug: post.slug, postTitle: post.title, postAuthor: post.author, postContent: post.content, postImage: post.image, postCreated: post.createdAt, postUpdated: post.updatedAt});
    } else {
      res.render('post', {postSlug: '404', postTitle: 'Post not found.', postAuthor: 'not-found', postContent: '<p>Sorry that I couldn\'t find what you\'re looking for :(</p>', postImage: 'not-found', postCreated: 'not-found', postUpdated: 'not-found'});
    }
  });
});

app.get('/:slug/amp', function (req, res) {
  Post.findOne({'slug': req.params.slug}, function (err, post) {
    if (err) {
      console.log(err);
    } else if (post) {
      res.render(__dirname + '/amp/post', {postSlug: post.slug, postTitle: post.title, postAuthor: post.author, postContent: post.content, postImage: post.image, postCreated: post.createdAt, postUpdated: post.updatedAt});
    } else {
      res.render(__dirname + '/amp/post', {postSlug: '404', postTitle: 'Post not found.', postAuthor: 'not-found', postContent: '<p>Sorry that I couldn\'t find what you\'re looking for :(</p>', postImage: 'not-found', postCreated: 'not-found', postUpdated: 'not-found'});
    }
  });
});

app.listen(port, function () {
  console.log('Quickl is listening on port ' + port)
});
