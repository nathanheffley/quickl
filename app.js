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

/* Start Index Routing */
app.get('/', function (req, res) {
  routeIndex(res, false);
});

app.get('/amp', function (req, res) {
  routeIndex(res, true);
});

function routeIndex(res, amp) {
  Post.find({}).limit(10).sort({createdAt: -1}).exec(function (err, posts) {
    if (err) throw err;
    if (amp) {
      res.render(__dirname + '/amp/index', { posts: posts });
    } else {
      res.render('index', { posts: posts });
    }
  });
}
/* End Index Routing */

/* Start Post Routing */
app.get('/:slug', function (req, res) {
  routePost(req, res, false);
});

app.get('/:slug/amp', function (req, res) {
  routePost(req, res, true);
});

function routePost(req, res, amp) {
  Post.findOne({'slug': req.params.slug}, function (err, post) {
    if (err) {
      console.log(err);
    } else if (post) {
      // If a post was found and is not null, change the response object to the post
      var resObj = {postSlug: post.slug, postTitle: post.title, postAuthor: post.author, postContent: post.content, postImage: post.image, postCreated: post.createdAt, postUpdated: post.updatedAt}
    } else {
      // Redirect missing pages to the 404 page.
      res.redirect('/'); // TODO: Redirect to 404 page.
    }

    // Finally, send the response object for the proper format
    if (amp) {
      res.render(__dirname + '/amp/post', resObj);
    } else {
      res.render('post', resObj);
    }
  });
}
/* End Post Routing */

app.listen(port, function () {
  console.log('Quickl is listening on port ' + port)
});
