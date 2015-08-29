var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./response');

var Issue = db.Model.extend({
  tableName: 'issues',
  hasTimestamps: true,
  owner: function() {
    return this.belongsTo('User');
  },
  solution: function() {
    return this.hasOne('Response');
  },
  isClosed: function() {
    return this.get('closed');
  }
}, {
  fetchIssuebyId: function(id) {
    return new this({
      id: id
    }).fetch({
      require: true
    });
  },

  fetchIssue: function(short_url) {
    return new this({
      short_url: short_url
    }).fetch({
      require: true
    });
  },

  newIssue: function() {
    return new this();
  },
});

module.exports = db.model('Issue', Issue);