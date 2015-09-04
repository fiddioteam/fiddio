var db      = require('../config'),
    Promise = require('bluebird');

require('../models/user');
require('../models/response');
require('../models/comment');

var Comments = db.Collection.extend({
  Model: db.model('Comment')
}, {
  fetchbyResponse: function(responseId) {
    return db.collection('Comments')
    .forge()
    .where('response_id', '=', responseId)
    .fetch();
  },
  fetchbyQuestion: function(questionId) {
    return db.collection('Comments')
    .forge()
    .where('response_id', '=', questionId)
    .fetch();
  }
});

module.exports = db.collection('Comments', Comments);