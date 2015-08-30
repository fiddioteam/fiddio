var db      = require('../config'),
    Promise = require('bluebird');

require('../models/user');
require('../models/issue');

var Users = db.Collection.extend({
  Model: db.model('User')
}, {
  usersWatchingIssue: function(issueId) {
    return db.collection('Users')
    .forge()
    .query(function(qb) {
      qb.join('issuesWatches', function() {
        this.on('issuesWatches.issue_id', '=', issueId)
        .andOn('issuesWatches.user_id', '=', 'users.id')
        // bookshelf would not handle, so used knex.raw
        .andOn(db.knex.raw("issuesWatches.active = 't'"));
      })
      .select('users.*')
      .from('users');
    })
    .fetch();
  }
});

module.exports = db.collection('Users', Users);