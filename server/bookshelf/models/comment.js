var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./question');
require('./response');

var Comment = db.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  owner: function() {
    return this.belongsTo('User');
  },
  type: function() {
    return this.get('type');
  },
  parent: function() {
    return {
      'question': parent_question,
      'response': parent_response,
      'comment': parent_comment
    }[this.type()]();
  },
  response: function() {
    return this.belongsTo('Response');
  },
  comment: function() {
    return this.belongsTo('Comment');
  },
  question: function() {
    return this.belongsTo('Question');
  },
  comments: function() {
    return this.hasMany('Comment', 'parent_id').query(function(qb){
      qb.where('parent_type', '=', 'comment');
    });
  }
}, {
  fetchCommentbyId: function(id) {
    return new this({
      id: id
    }).fetch({
      require: true,
      withRelated: ['owner', 'comments', 'comments.owner']
    });
  },
  newComment: function(options) {
    return new this(options);
  },
});

module.exports = db.model('Comment', Comment);