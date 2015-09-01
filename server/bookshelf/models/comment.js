var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./response');

var Comment = db.Model.extend({
  tableName: 'comments',
  hasTimestamps: true,
  owner: function() {
    return this.belongsTo('User');
  },
  response: function() {
    return this.belongsTo('Response');
  },
  comment: function() {
    return this.belongsTo('Comment');
  },
  comments: function() {
    return this.hasMany('Comment');
  }
}, {
  fetchCommentbyId: function(id) {
    return new this({
      id: id
    }).fetch({
      require: true
    });
  },

  newComment: function(options) {
    return new this(options);
  },
});

module.exports = db.model('Comment', Comment);