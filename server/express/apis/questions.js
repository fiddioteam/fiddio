var db      = require('../../bookshelf/config'),
    utility = require('../../utility');

require('../../bookshelf/models/question');
require('../../bookshelf/collections/responses');

module.exports = function(app, router) {
  router.get('/questions/:id', function(req, res, next) {
    var id = utility.getUrlParamNum(req, 'id');

    db.model('Question').fetchQuestionbyId(id)
    .then( function(question) {
      res.json(question.toJSON());
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
};