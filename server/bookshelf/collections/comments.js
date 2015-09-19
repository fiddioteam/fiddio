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
      qb.where('parent_type', '=', 'response').andWhere('parent_id', '=', responseId);
    })
    .fetch({ require: false, withRelated: ['owner', 'comments', 'comments.owner'] });
  },
  fetchbyQuestionId: function(questionId) {
    return db.collection('Comments')
    .forge()
    .query(function(qb){
      qb.where('parent_type', '=', 'question').andWhere('parent_id', '=', questionId);
    })
    .fetch({ require: false, withRelated: ['owner', 'comments', 'comments.owner'] });
  },
  fetchbyCommentId: function(commentId) {
    return db.collection('Comments')
    .forge()
    .query(function(qb){
      qb.where('parent_type', '=', 'comment').andWhere('parent_id', '=', commentId);
    })
    .fetch({ require: false, withRelated: ['owner', 'comments', 'comments.owner'] });
  }
});

module.exports = db.collection('Comments', Comments);