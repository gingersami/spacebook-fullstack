const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer();

mongoose.connect('mongodb://localhost/spacebookDB', function () {
    console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('jquery-ui'));
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

var storage = multer.diskStorage(({
    destination: function (req, file, cb) {
        cb(null, '/tmp/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
}));

var uploader = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if ((!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))) {
            return cb(new Error('Only Image Files Allowed'))
        }
        cb(null, true)
    }
}).single('postFile')

// 1) to handle getting all posts and their comments
app.get('/posts', (req, res) => {
    Post.find().exec(function (err, data) {
        res.send(data)
    })
})
// 2) to handle adding a post
app.post('/posts', (req, res) => {
    var post = new Post({
        text: req.body.textReferenceError: uploader is not defined

    })
    post.save(function (err, data) {``
        res.send(data);
    });
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
    Post.findByIdAndUpdate(req.params.postid,
        { $push: { comments: comment } }, { new: true }, function (err, data) {
            res.send(data)
        })
})

// 5) to handle deleting a comment from a post
app.delete('/posts/:postid/comments/:commid', function (req, res) {
    Post.findByIdAndUpdate(req.params.postid,
        { $pull: { comments: { _id: req.params.commid } } }, { new: true }, function (err, data) {
            if (err) throw err;
            else {
                res.send(data)
            }
        })
})

app.post('/upload', uploader, function (req, res, next) {
    if (!req.file) {
        return next(new Error("Please Select File to Upload"))
    }
    readFile(req.file.path, function (err, data) {
        if (err) throw err
        else {
            res.send(data)
        }
    })

})


app.listen(8080, function () {
    console.log("what do you want from me! get me on 8000 ;-)");
})