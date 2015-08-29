var db      = require('../config');

require('./issue');
require('./user');

var IssueTag = db.Model.extend({
  tableName: 'issues_tags',
  issue: function() {
    return this.belongsTo('Issue');
  },
  user: function() {
    return this.belongsTo('User');
  }
});

module.exports = db.model('IssueTag', IssueTag);