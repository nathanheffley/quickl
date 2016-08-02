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
    var resObj = {}

    if (err) {
      console.log(err);
    } else if (post) {
      // If a post was found and is not null, change the response object to the post
      resObj = {postSlug: post.slug,
                postTitle: post.title,
                postAuthor: post.author,
                postContent: post.content,
                postImage: post.image,
                postCreated: post.createdAt,
                postUpdated: post.updatedAt}
    } else {
      // Redirect missing pages to the 404 page.
      res.redirect('/'); // TODO: Redirect to 404 page.
      return;
    }

    // Set the next and last posts
    findNextPost(post.createdAt, function (nextPost) {
      resObj.nextPostSlug  = nextPost.slug;
      resObj.nextPostTitle = nextPost.title;
      resObj.nextPostImage = nextPost.image;
      resObj.nextPostAuthor = nextPost.author;
      resObj.nextPostCreated = nextPost.createdAt;

      findLastPost(post.createdAt, function (lastPost) {
        resObj.lastPostSlug  = lastPost.slug;
        resObj.lastPostTitle = lastPost.title;
        resObj.lastPostImage = lastPost.image;
        resObj.lastPostAuthor = lastPost.author;
        resObj.lastPostCreated = lastPost.createdAt;

        // Finally, serve the resObj in the proper formatting
        if (amp) {
          res.render(__dirname + '/amp/post', resObj);
        } else {
          res.render('post', resObj);
        }
      });
    });
  });
}
/* End Post Routing */

// Find the next post information
function findNextPost(currentPostDate, callback) {
  Post.findOne({createdAt: {$gt: currentPostDate}}).select('slug title image author createdAt').sort({createdAt: 1}).exec(function (err, post) {
    if (err) {
      console.log(err);
    } else if (post) {
      callback(post);
      return;
    }
    callback(emptyPost());
  });
}

// Find the last post information
function findLastPost(currentPostDate, callback) {
  Post.findOne({createdAt: {$lt: currentPostDate}}).select('slug title image author createdAt').sort({createdAt: -1}).exec(function (err, post) {
    if (err) {
      console.log(err);
    } else if (post) {
      callback(post);
      return;
    }
    callback(emptyPost());
  });
}

function emptyPost() {
  var emptyPost = {slug: '#', title: 'No more this way.', image: 'no-image', author: 'No Author', createdAt: 'no-date'};
  return emptyPost;
}

app.listen(port, function () {
  console.log('Quickl is listening on port ' + port)
});
