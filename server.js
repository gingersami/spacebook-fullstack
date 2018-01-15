var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// dummy posts
// var post = new Post({
//   text:"BLA BLA",
//   comments:[{
//     user:"Dor",
//     text:"I HATE THINGS"
//   }, {
//     user:"Not Dor",
//     text:"I also hate things"
//   }]
// })
// post.save()

// You will need to create 5 server routes
// These will define your API:
// 


// 1) to handle getting all posts and their comments
app.get('/posts', (req, res) => {
  Post.find().exec(function (err, data) {
    res.send(data)
  })
})
// 2) to handle adding a post
app.post('/posts', (req, res) => {
  var post = new Post({
    text: req.body.text,
    comments: []
  })
  post.save();
})

// TEST ROUTE
app.get('/posts/:postid', function (req, res) {
  postid = req.params.postid
  Post.findById(postid, function (err, data) {
    res.send(data)
  })
})

// 3) to handle deleting a post
app.delete('/posts/:postid', function (req, res) {
  Post.findByIdAndRemove(req.params.postid, function (err, data) {
    if (err) throw err;
    res.send(data)
  })
})

// 4) to handle adding a comment to a post
app.post('/posts/:postid/comments', function (req, res) {
  var comment = {
    user: req.body.user,
    text: req.body.text
  }
  Post.findByIdAndUpdate(req.params.postid, {
    $push: {
      comments: comment
    }
  }, {
    new: true
  }, function (err, data) {
    res.send(data)
  })
})

// 5) to handle deleting a comment from a post
app.delete('/posts/:postid/comments/:commid', function (req, res) {
  var postid = req.params.postid
  var commid = req.params.commid
  Post.findByIdAndUpdate(req.params.postid, {
    $pull: {
      comments: {
        _id: req.params.commid
      }
    }
  }, {
    new: true
  }, function (err, data) {
    res.send(data)
  })
})

app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
})