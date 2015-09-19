var db      = require('../../bookshelf/config'),
    utility = require('../../utility'),
    url     = require('url');

require('../../bookshelf/models/response');
require('../../bookshelf/models/comment');
require('../../bookshelf/models/question');
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

  function getComments(req, res, next) {
    db.collection('Comments')
    .fetchbyCommentId(req.body.id)
    .then( function(comments) {
      res.json({ comments: comments.toJSON() });
    });
  }

  function postFromResponse(req, res, next) {
    postComment( db.model('Response')
    .fetchResponsebyId(req.body.id)
    .then( function(response) {
      if (response) {
        return { parent_type: 'response', parent_id: response.id };
      } else { return Promise.reject('Bad response id'); }
    }), req, res, next);
  }

  function postFromComment(req, res, next) {
    postComment( db.model('Comment')
    .fetchCommentbyId(req.body.id)
    .then( function(comment) {
      if (comment) {
        return { parent_type: 'comment', parent_id: comment.id };
      } else { return Promise.reject('Bad comment id'); }
    }), req, res, next );
  }

  function postFromQuestion(req, res, next) {
    postComment( db.model('Question')
    .fetchQuestionbyId(req.body.id)
    .then( function(question) {
      if (question) {
        return { parent_type: 'question', parent_id: question.id };
      } else { return Promise.reject('Bad question id'); }
    }), req, res, next );
  }

  function getCommentHandler(req, res, next) {
    req.body.id = utility.getUrlParamNums(req, 'comment_id').comment_id;
    next();
  }

  function postCommentHandler(req, res, next) {
    var params = utility.getUrlParamNums(req, 'question_id', 'response_id', 'comment_id');

    if (params.question_id) { req.body.id = params.question_id; postFromQuestion(req, res, next); }
    else if (params.response_id) { req.body.id = params.response_id; postFromResponse(req, res, next); }
    else if (params.comment_id) { req.body.id = params.comment_id; postFromComment(req, res, next); }
    else { next(); }
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
    .then(function(comment){
      return comment.fetch({withRelated: 'owner'});
    })
    .then( function(comment) {
      res.json(comment.toJSON());
    })
    .catch( function(err) {
      res.sendStatus(500); // Uh oh!
      if (process.isDev()) { res.json({ error: err }); }
    });
  }

  router.get('/comment', getCommentHandler, getComment );
  router.get('/comment/:comment_id', getCommentHandler, getComment );
  router.get('/comment/:comment_id/comments', getCommentHandler, getComments );

  router.post('/comment', utility.hasSession, postCommentHandler); // id specified in req.body as response_id or comment_id
  router.post('/response/:response_id/comment', utility.hasSession, postCommentHandler);
  router.post('/comment/:comment_id/comment', utility.hasSession, postCommentHandler);
  router.post('/question/:question_id/comment', utility.hasSession, postCommentHandler);

};