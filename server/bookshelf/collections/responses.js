var db      = require('../config'),
    Promise = require('bluebird');

require('../models/user');
require('../models/question');
require('../models/response');

var Responses = db.Collection.extend({
  Model: db.model('Response')
}, {
  fetchbyQuestion: function(questionId) {
    return db.collection('responses')
    .forge()
    .where('question_id', '=', questionId)
    .fetch();
  }
});

module.exports = db.collection('Responses', Responses);