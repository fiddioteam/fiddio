var db      = require('../config'),
    Promise = require('bluebird');

require('../models/user');
require('../models/issue');

var Issues = db.Collection.extend({
  Model: db.model('Issue')
}, {
  issuesStarredbyUser: function(userId) {
    return db.collection('Issues').forge()
    .query(function(qb) {
      qb.join('stars', function() {
        this.on('stars.issue_id', '=', 'issues.id')
        .andOn('stars.user_id', '=', userId)
        // bookshelf would not handle, so used knex.raw
        .andOn(db.knex.raw("stars.active = 't'"));
      })
      .select('issues.*')
      .from('issues');
    })
    .fetch();
  },
  issuesbyUser: function(userId) {
    return db.collection('Issues')
    .forge()
    .where('user_id', '=', userId)
    .fetch();
  }
});

module.exports = db.collection('Issues', Issues);