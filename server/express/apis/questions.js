var db      = require('../../bookshelf/config'),
    utility = require('../../utility');

require('../../bookshelf/models/question');
require('../../bookshelf/models/response');
require('../../bookshelf/models/star');
require('../../bookshelf/models/questionWatch');
require('../../bookshelf/collections/questions');
require('../../bookshelf/collections/responses');

module.exports = function(app, router) {

  function getQuestion(req, res, next) {
    db.model('Question').fetchQuestionbyId(req.body.id)
    .then( function(question) {
      res.json(question.toJSON());
    })
    .catch( function(err) {
      res.sendStatus(400); // Bad Request
    });
  }

  function getQuestions(req, res, next) {
    db.collection('Questions').fetchQuestionsHead()
    .then( function(questions) {
      res.json({ questions: questions.toJSON() });
    });
  }

  function getResponses(req, res, next) {
    db.collection('Responses').fetchbyQuestionId(req.body.id)
    .then( function(responses) {
      res.json({ responses: responses.toJSON() });
    })
    .catch( function(err) {
      res.sendStatus(400); // Bad Request
    });
  }

  function getComments(req, res, next) {
    db.collection('Comments').fetchbyQuestionId(req.body.id)
    .then( function(comments) {
      res.json({ comments: comments.toJSON() });
    })
    .catch( function(err) {
      res.sendStatus(400); // Bad Request
    });
  }

  function getStarred(req, res, next) {
    if (req.user) {
      var user_id = req.user.get('id');
      db.model('Star').fetchStar(user_id, req.body.id)
      .then(function(star) {
        res.json({starred: star && star.get('active')});
      });
    } else {
      res.json({starred: false});
    }
  }

  function postStar(req, res, next) {
    var star = utility.getUrlParamNums(req, 'star').star;
    process.verb('Star', star, 'User', req.user.id, 'question_id', req.body.id);

    db.model('Star').fetchOrCreate(req.user.id, req.body.id, star)
    .spread( function(star, question) {
      res.json({ result: true });
    })
    .catch( function(err) {
      //res.sendStatus(500); // Uh oh!
      process.verb('ERROR!', err);
      if (process.isDev()) { res.json({ error: err }); }
    });
  }

  function postWatch(req, res, next) {
    var watch = utility.getUrlParamNums(req, 'watch').watch;

    db.model('QuestionWatch').fetchOrCreate(req.user.id, req.body.id, watch)
    .then( function(question) {
      res.json({ result: true });
    })
    .catch( function(err) {
      res.sendStatus(500); // Uh oh!
      if (process.isDev()) { res.json({ error: err }); }
    });
  }

  function postQuestion(req, res, next) {
    db.model('Question').newQuestion({
      title: req.body.title,
      body: req.body.body,
      code: req.body.code,
      user_id: req.user.id,
    }).save().then( function(question) {
      res.json(question.toJSON());
    }).catch(function(err){
      res.sendStatus(500); // Uh oh!
      if (process.isDev()) { res.json({ error: err }); }
    });
  }

  function questionHandler(req, res, next) {
    req.body.id = utility.getUrlParamNums(req, 'question_id').question_id;
    next();
  }

  router.get('/questions', getQuestions);

  router.get('/question/star', utility.hasSession, questionHandler, getStarred); // question_id is in query
  router.get('/question/responses', questionHandler, getResponses); // question_id is in query
  router.get('/question/comments', questionHandler, getComments); // question_id is in query
  router.get('/question/:question_id', questionHandler, getQuestion);
  router.get('/question/:question_id/responses', questionHandler, getResponses);
  router.get('/question/:question_id/comments', questionHandler, getComments);
  router.get('/question/:question_id/star', utility.hasSession, questionHandler, getStarred);

  router.post('/question', utility.hasSession, postQuestion);
  router.post('/question/star', utility.hasSession, questionHandler, postStar);
  router.post('/question/watch', utility.hasSession, questionHandler, postWatch );
  router.post('/question/:question_id/star', utility.hasSession, questionHandler, postStar);
  router.post('/question/:question_id/watch', utility.hasSession, questionHandler, postWatch );

};
