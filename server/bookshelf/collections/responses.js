var db      = require('../config'),
    Promise = require('bluebird');

require('../models/user');
require('../models/question');
require('../models/response');

var Responses = db.Collection.extend({
  model: db.model('Response')
}, {
  fetchbyQuestionId: function(questionId) {
    return db.collection('Responses')
    .forge()
    .query(function(qb){
      qb.where('question_id', '=', questionId);
    })
    .fetch({withRelated: 'owner'});
  }
});

module.exports = db.collection('Responses', Responses);