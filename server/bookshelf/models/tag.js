var db      = require('../config');

require('./issue');

var Tag = db.Model.extend({
  tableName: 'tags',
  issues: function() {
    return this.belongsToMany('Issue').through('IssueTag');
  }
});

module.exports = db.model('Tag', Tag);