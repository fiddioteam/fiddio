var db      = require('../../bookshelf/config'),
    utility = require('../../utility'),
    url     = require('url');

require('../../bookshelf/models/response');
require('../../bookshelf/models/comment');
require('../../bookshelf/collections/comments');

module.exports = function(app, router) {

  var postFromResponse = function(req, res, next) {
    var id = utility.getId(req);

    postComment(db.model('Response').fetchResponsebyId(id)
    .fetch( function(response) {
      if (response) {
        return { response_id: response.id };
      } else { return Promise.reject('Bad response id'); }
    }), req, res, next);
  };

  var postFromComment = function(req, res, next) {
    var id = utility.getId(req);

    postComment( db.model('Comment').fetchCommentbyId(id)
    .fetch( function(comment) {
      if (comment) {
        return { comment_id: comment.id };
      } else { return Promise.reject('Bad comment id'); }
    }), req, res, next );
  };

  var postFromQuery = function(req, res, next) {
    var response_id = parseInt( url.parse(req.url, true).query.response_id );
    var comment_id = parseInt( url.parse(req.url, true).query.comment_id );
    if (response_id) { postFromResponse(req,res,next); }
    else if (comment_id) { postFromComment(req,res,next); }
  };

  var postComment = function(promise, req, res, next) {
    promise.then( function(options) {

      options.user_id = req.user.id;
      options.body = req.body.body;

      return db.model('Comment')
      .newComment(options)
      .save();
    })
    .catch( function(err) {
      process.verb('Error:', err);
    })
    .then( function(comment) {
      res.json(comment.toJSON());
    });
  };

  router.post('/response/:id/comment', utility.hasSession(), postFromResponse);
  router.post('/response/comment', utility.hasSession(), postFromResponse); // id specified in query as ?id=1
  router.post('/comment/:id/comment', utility.hasSession(), postFromComment);
  router.post('/comment/comment', utility.hasSession(), postFromComment); // id specified in query as ?id=1
  router.post('/comment', utility.hasSession(), posFromQuery); // response_id or comment_id should be in req.body
};




