var db      = require('../../bookshelf/config'),
    utility = require('../../utility'),
    url     = require('url');

require('../../bookshelf/models/response');
require('../../bookshelf/models/comment');
require('../../bookshelf/collections/comments');

module.exports = function(app, router) {

  function getComment(req, res, next) {
    db.model('Comment')
    .fetchCommentbyId(req.body.id)
    .then( function(comment) {
      res.json(comment.toJSON());
    })
    .catch( function(err) {
      res.sendStatus(400); // Bad Request!
    });
  }

  function postFromResponse(req, res, next) {
    postComment(db.model('Response')
    .fetchResponsebyId(req.body.id)
    .then( function(response) {
      if (response) {
        return { response_id: response.id };
      } else { return Promise.reject('Bad response id'); }
    }), req, res, next);
  }

  function postFromComment(req, res, next) {
    postComment( db.model('Comment')
    .fetchCommentbyId(req.body.id)
    .then( function(comment) {
      if (comment) {
        return { comment_id: comment.id };
      } else { return Promise.reject('Bad comment id'); }
    }), req, res, next );
  }

  function getCommentHandler(req, res, next) {
    req.body.id = utility.getUrlParamNums(req, 'comment_id').comment_id;
    next();
  }

  function postCommentHandler(req, res, next) {
    var params = utility.getUrlParamNums(req, 'response_id', 'comment_id');

    if (params.response_id) { req.body.id = params.response_id; postFromResponse(req, res, next); }
    else if (params.comment_id) { req.body.id = params.comment_id; postFromComment(req, res, next); }
  }

  function postComment(promise, req, res, next) {
    promise.then( function(options) {

      options.user_id = req.user.id;
      options.body = req.body.body;
      options.timeslice = req.body.timeslice;

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
  }

  router.get('/comment', getCommentHandler, getComment );
  router.get('/comment/:comment_id', getCommentHandler, getComment );

  router.post('/comment', utility.hasSession, postCommentHandler); // id specified in req.body as response_id or comment_id
  router.post('/response/:response_id/comment', utility.hasSession, postCommentHandler);
  router.post('/comment/:comment_id/comment', utility.hasSession, postCommentHandler);

};