var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");
  // _renderPosts();
  _retrievePosts();

  function _retrievePosts() {
    $.get({
      url: '/posts',
      success: function (data) {
        for (i in data) {
          posts[i] = data[i];
          _renderPosts();
        }
        console.log(posts)
      }
    })
  }

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    $.ajax({
      type: "POST",
      url: "/posts",
      data: {
        text: newPost
      },
      success: function () {
        _retrievePosts();
      }

    })
    posts.push({
      text: newPost,
      comments: []
    });
    _renderPosts();
  }


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (index) {
    $.ajax({
      type: "DELETE",
      url: "/posts/" + index,
      success: function (data) {
        _retrievePosts()
      }
    })
  };

  var addComment = function (newComment, postID, postIndex) {
    $.ajax({
      type: "POST",
      url: "/posts/" + postID + "/comments",
      data: newComment,
      success: function () {
        _retrievePosts()
      }
    })
    posts[postIndex].comments.push(newComment);
    _renderComments(postIndex);
  };


  var deleteComment = function (postIndex, commentIndex, commentID, postID) {
    $.ajax({
      type: "DELETE",
      url: '/posts/' + postID + "/comments/" + commentID,
      success:function(){
        _retrievePosts();
      }
    })
    posts[postIndex].comments.splice(commentIndex, 1);
    _renderComments(postIndex);
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').data("id");
  app.removePost(index);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var postID = $(this).closest('.post').data('id')
  var newComment = {
    text: $comment.val(),
    user: $user.val()
  };

  app.addComment(newComment, postID, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var postID = $(this).closest('.post').data('id');
  var commentIndex = $(this).closest('.comment').index();
  var commentID = $(this).closest('.comment').data('id');

  app.deleteComment(postIndex, commentIndex, commentID, postID);
});