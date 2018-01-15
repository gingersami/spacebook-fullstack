var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments

//you don't need a comments collection
//you only need a posts collection

var commentSchema = new mongoose.Schema({

});


var postSchema = new mongoose.Schema({

});

var Post = mongoose.model('post', postSchema)

module.exports = Post
