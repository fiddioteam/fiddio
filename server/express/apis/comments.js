var db      = require('../../bookshelf/config'),
    utility = require('../../utility'),
    url     = require('url');
// loads necessary Bookshelf components
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

  function postComment(parent, req, res, next) {
    parent.promise
    .then( function(model) {
      if (model) {
        return {
          parent_type: parent.type,
          parent_id: model.get('id')
        };
      } else {
        return Promise.reject('Bad id');
      }
    })
    .then( function(options) {
      options.user_id = req.user.id;
      options.body = req.body.body;
      options.timeslice = req.body.timeslice;

      return db.model('Comment')
      .newComment(options)
      .save();
    })
    .then(function(comment){
      return comment.fetch({ withRelated: 'owner' });
    })
    .then( function(comment) {
      res.json(comment.toJSON());
    })
    .catch( function(err) {
      //res.sendStatus(500); // Uh oh!
      if (process.isDev()) { res.json({ error: err }); }
    });
  }

  function getCommentHandler(req, res, next) {
    req.body.id = utility.getUrlParamNums(req, 'comment_id').comment_id;
    next();
  }

  function postCommentHandler(req, res, next) {
    var params = utility.getUrlParamNums(req, 'question_id', 'response_id', 'comment_id');
    var parent = {};

    if (params.question_id) {
      parent.promise = db.model('Question').fetchQuestionbyId(params.question_id);
      parent.type = 'question';
    } else if (params.response_id) {
      parent.promise = db.model('Response').fetchResponsebyId(params.response_id);
      parent.type = 'response';
    } else if (params.comment_id) {
      parent.promise = db.model('Comment').fetchCommentbyId(params.comment_id);
      parent.type = 'comment';
    } else { next(); return; }

    postComment(parent, req, res, next);
  }

  router.get('/comment', getCommentHandler, getComment );
  router.get('/comment/:comment_id', getCommentHandler, getComment );
  router.get('/comment/:comment_id/comments', getCommentHandler, getComments );

  router.post('/comment', utility.hasSession, postCommentHandler); // id specified in req.body as response_id or comment_id
  router.post('/response/:response_id/comment', utility.hasSession, postCommentHandler);
  router.post('/comment/:comment_id/comment', utility.hasSession, postCommentHandler);
  router.post('/question/:question_id/comment', utility.hasSession, postCommentHandler);
};