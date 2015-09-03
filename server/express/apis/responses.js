var db      = require('../../bookshelf/config'),
    utility = require('../../utility');

require('../../bookshelf/models/response');
require('../../bookshelf/collections/comments');

module.exports = function(app, router) {
  router.get('/response/:id', function(req, res, next) {
    var id = utility.getUrlParamNum(req, 'id');

    db.model('Response').fetchResponsebyId(id)
    .then( function(response) {
      res.json(response.toJSON());
    })
    .catch( function(err) {
      process.verb('Error:', err);
    });
  });

  router.get('/questions/:id/responses', function(req, res, next) {
    var id = utility.getUrlParamNums(req, 'id').id;

    db.collection('Responses').fetchbyQuestion(id)
    .then( function(responses) {
      res.json({ responses: responses.toJSON() });
    });
  });

  router.get('/questions/user/:userid', function(req, res, next) {
    var userid = utility.getUrlParamNums(req, 'id').userid;

    db.collection('Questions').fetchbyUser(params.userid)
    .then( function(questions) {
      res.json({ questions: questions.toJSON() });
    });

  });
};