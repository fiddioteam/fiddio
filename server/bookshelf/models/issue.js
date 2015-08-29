var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./response');
require('./tag');
require('./issuetag');

var Issue = db.Model.extend({
  tableName: 'issues',
  hasTimestamps: true,
  defaults: {
    star_count: 0
  },
  owner: function() {
    return this.belongsTo('User');
  },
  solution: function() {
    return this.hasOne('Response');
  },
  isClosed: function() {
    return this.get('closed');
  },
  tags: function() {
    return this.hasMany('Tag').through('IssueTag');
  },
  changeStars: function(upOrDown) {
    this.set('star_count', this.get('star_count') + upOrDown);
    return this.save();
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