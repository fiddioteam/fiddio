var db      = require('../../bookshelf/config'),
    utility = require('../../utility');

require('../../bookshelf/models/response');
require('../../bookshelf/models/comment');
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

  router.get('/response/:id/comments', function(req, res, next) {
    var id = utility.getUrlParamNums(req, 'id').id;

    db.collection('Comments').fetchbyResponse(id)
    .then( function(comments) {
      res.json({ comments: comments.toJSON() });
    });
  });
};