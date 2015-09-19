var db      = require('../config'),
    Promise = require('bluebird');

require('../models/user');
require('../models/question');

var Users = db.Collection.extend({
  model: db.model('User')
}, {
  usersWatchingQuestion: function(questionId) {
    return db.collection('Users')
    .forge()
    .query(function(qb) {
      qb.join('questionsWatches', function() {
        this.on('questionsWatches.question_id', '=', questionId)
        .andOn('questionsWatches.user_id', '=', 'users.id')
        // bookshelf would not handle, so used knex.raw
        .andOn(db.knex.raw("questionsWatches.active = 't'"));
      })
      .select('users.*')
      .from('users');
    })
    .fetch();
  }
});

module.exports = db.collection('Users', Users);