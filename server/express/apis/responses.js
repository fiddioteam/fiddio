var db      = require('../../bookshelf/config'),
    Promise = require('bluebird'),
    fs      = Promise.promisifyAll(require('fs')),
    path    = require('path'),
    utility = require('../../utility'),
    upload  = require('multer')({ dest: '../../uploads/' });

require('../../bookshelf/models/user');
require('../../bookshelf/models/response');
require('../../bookshelf/models/comment');
require('../../bookshelf/models/question');
require('../../bookshelf/models/vote');
require('../../bookshelf/collections/comments');

module.exports = function(app, router) {

  function getResponse(req, res, next) {
    db.model('Response')
    .fetchResponsebyId(req.body.id)
    .then( function(response) {
      res.json(response.toJSON());
    })
    .catch( function(err) {
      process.verb('Error:', err);
    });
  }

  function getComments(req, res, next) {
    db.collection('Comments')
    .fetchbyResponse(req.body.id)
    .then( function(comments) {
      res.json({ comments: comments.toJSON() });
    });
  }

  function postVote(req, res, next) {
    db.model('Vote')
    .fetchOrCreate(req.user.id, req.body.id, req.body.vote)
    .then( function(response) {
      res.json({ result: true });
    })
    .catch( function(err) {
      res.sendStatus(400); // Bad Request!
    });
  }

  function postMark(req, res, next) {
    db.model('Response')
    .fetchResponsebyId(req.body.id)
    .then( function(response) {
      if (response.get('user_id') === req.user.id) {
        return [response.id, response
        .related('question')
        .fetch({ require: true })];
      }
    })
    .spread( function(responseId, question) {
      return question.markSolution(responseId);
    })
    .then( function(question) {
      res.json({ result: true });
    })
    .catch( function(err) {
      res.sendStatus(400); // Bad Request!
    });
  }

  function postResponse(req, res, next) {
    if (!req.file) { res.sendStatus(409); } // Conflict!

    db.model('Question')
    .fetchQuestionbyId(req.body.id)
    .then( function(question) {
      return db.model('Response').newResponse({
        //title: req.body.title,
        body: req.body.body,
        code: req.body.code,
        duration: req.body.duration,
        user_id: req.user.id,
        code_changes: JSON.stringify(req.body.code_changes) // WORK?
      });
    })
    .then( function(response) {
      return fs.renameAsync(req.file.path, path.join(req.file.destination, response.id + '.mp3'));
    })
    .then( function(){
      res.json(response.toJSON());
    })
    .catch( function(err) {
      res.sendStatus(400); // Bad Request!
    });
  }

  function getQuestionId(req, res, next) {
    req.body.id = utility.getUrlParamNums(req, 'question_id').question_id;
    next();
  }

  function getResponseId(req, res, next) {
    req.body.id = utility.getUrlParamNums(req, 'response_id').response_id;
    next();
  }

  router.get('/response', getResponseId, getResponse);
  router.get('/response/comments', getResponseId, getComments);
  router.get('/response/:response_id', getResponseId, getResponse);
  router.get('/response/:response_id/comments', getResponseId, getComments);

  router.post('/response', utility.hasSession, getQuestionId, upload.single('response'), postResponse);
  router.post('/response/mark', utility.hasSession, getResponseId, postMark);
  router.post('/response/vote', utility.hasSession, getResponseId, postVote);
  router.post('/response/:question_id', utility.hasSession, getQuestionId, upload.single('response'), postResponse);
  router.post('/response/:response_id/mark', utility.hasSession, getResponseId, postMark);
  router.post('/response/:response_id/vote', utility.hasSession, getResponseId, postVote);
};