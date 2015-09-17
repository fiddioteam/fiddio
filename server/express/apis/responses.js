var db      = require('../../bookshelf/config'),
    Promise = require('bluebird'),
    fs      = Promise.promisifyAll(require('fs')),
    path    = require('path'),
    utility = require('../../utility'),
    upload  = require('multer')({ dest: './uploads/' });

require('../../bookshelf/models/user');
require('../../bookshelf/models/response');
require('../../bookshelf/models/comment');
require('../../bookshelf/models/question');
require('../../bookshelf/models/vote');
require('../../bookshelf/collections/comments');

module.exports = function(app, router) {

  function getResponse(req, res, next) {
    db.model('Response')
    .fetchResponsebyId(req.body.id, true)
    .then( function(response) {
      return [response,
      db.model('Vote')
      .fetchVote(req.user.id, req.body.id, true)];
    })
    .spread( function(response, vote) {
      var responseJSON = {};
      if (response) {
        responseJSON = response.toJSON();
        responseJSON.vote = (vote && vote.get('up_down')) || 0;
      }

      res.json(responseJSON);
    });
  }

  function getComments(req, res, next) {
    db.collection('Comments')
    .fetchbyResponseId(req.body.id)
    .then( function(comments) {
      res.json({ comments: comments.toJSON() });
    });
  }

  function getVote(req, res, next) {
    db.model('Vote')
    .fetchVote(req.user.id, req.body.id, true)
    .then( function(vote) {
      res.json({ vote: (vote && vote.get('up_down')) || 0 });
    });
  }

  function postVote(req, res, next) {
    if (req.user) {
      db.model('Vote')
      .fetchOrCreate(req.user.id, req.body.id, req.body.vote)
      .spread( function(vote, response) {
        if (vote && response) {
          res.json({ result: true, vote_count: response.get('vote_count') });
        } else { res.json({ result: false }); }
      });
    } else { res.json({ result: false }); }
  }

  function postMark(req, res, next) {
    db.model('Response')
    .fetchResponsebyId(req.body.id)
    .then( function(response) {
      return [response && response.id, response && response
      .related('question')
      .fetch({ require: true })];
    })
    .spread( function(responseId, question) {
      if (responseId && question && question.get('user_id') === req.user.id) {
        return question.markSolution(responseId);
      }
    })
    .then( function(question) {
      res.json({ result: !!question.get('solution') });
    });
  }

  function postResponse(req, res, next) {
    if (!req.file) { res.sendStatus(409); return; } // Conflict!

    db.model('Question')
    .fetchQuestionbyId(req.body.id)
    .then( function(question) {
      return [question, db.model('Response').newResponse({
        //title: req.body.title,
        body: req.body.body,
        code: req.body.code,
        duration: req.body.duration,
        user_id: req.user.id,
        question_id: req.body.id,
        code_changes: req.body.code_changes
      }).save()];
    })
    .spread( function(question, response) {
      return [question.addResponse(), response, fs.renameAsync(req.file.path, path.join(req.file.destination, response.id + '.mp3'))];
    })
    .spread( function(question, response, error) {
      if (error) { process.verb('Error on rename', error); }
      else {
        res.json(response.toJSON());
      }
    })
    .catch(function(err){
      res.sendStatus(500); // Uh oh!
      if (process.isDev()) { res.json({ error: err }); }
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
  router.get('/response/:response_id/vote', utility.hasSession, getResponseId, getVote);
  router.get('/response/:response_id/comments', getResponseId, getComments);

  router.post('/response', utility.hasSession, upload.single('response'), getQuestionId, postResponse);
  router.post('/response/mark', utility.hasSession, getResponseId, postMark);
  router.post('/response/vote', utility.hasSession, getResponseId, postVote);
  router.post('/response/:question_id', utility.hasSession, upload.single('response'), getQuestionId, postResponse);
  router.post('/response/:response_id/mark', utility.hasSession, getResponseId, postMark);
  router.post('/response/:response_id/vote', utility.hasSession, getResponseId, postVote);
};