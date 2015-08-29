var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./issue');

var IssueWatch = db.Model.extend({
  tableName: 'issuesWatches',
  user: function() {
    return this.belongsTo('User');
  },
  issue: function() {
    return this.hasOne('Issue');
  },
  // only one star per user
  fetchOrCreate: function(user, issue, active) {
    var options = {
      user: user,
      issue: issue
    };
    var newIssueWatch = new this(options);

    // create the model object
    // determines if already a IssueWatch in database
    newIssueWatch.fetch()
    .then(function(issuewatch) {
      if (!issuewatch) {
        issuewatch = newIssueWatch;
      }
      issuewatch.set('active', active);
      return issuewatch.save();
    });
  },
});

module.exports = db.model('IssueWatch', IssueWatch);