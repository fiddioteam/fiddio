var db      = require('../config'),
    Promise = require('bluebird');

require('../models/user');
require('../models/response');
require('../models/comment');

var Comments = db.Collection.extend({
  model: db.model('Comment')
}, {
  fetchbyResponseId: function(responseId) {
    return db.collection('Comments')
    .forge()
    .query(function(qb){
      qb.where('response_id', '=', responseId);
    })
    .fetch();
  },
  fetchbyQuestionId: function(questionId) {
    return db.collection('Comments')
    .forge()
    .query(function(qb){
      qb.where('question_id', '=', questionId);
    })
    .fetch();
  }
});

module.exports = db.collection('Comments', Comments);