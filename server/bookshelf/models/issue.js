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
  },
  stars: function() {
    return this.hasMany('Star').through('Stars').withPivot('active');
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
  newIssue: function(options) {
    return new this(options);
  },
  changeStarsbyId: function(issueId, upOrDown) {
    return db.model('Issue')
    .fetchIssuebyId(issueId)
    .then(function(issue) {
      issue.set('star_count', issue.get('star_count') + upOrDown);
      return issue.save();
    });
  }
});

module.exports = db.model('Issue', Issue);