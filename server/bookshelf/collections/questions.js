var db      = require('../config'),
    Promise = require('bluebird');

require('../models/user');
require('../models/question');

var Questions = db.Collection.extend({
  model: db.model('Question')
}, {
  fetchQuestionsHead: function() {
    return db.collection('Questions')
     .forge().fetch({
       columns: ['title', 'response_count', 'star_count', 'user_id', 'id'],
       withRelated: 'owner'
     });
  },
  fetchStarredbyUser: function(userId) {
    return db.collection('Questions')
    .forge()
    .query(function(qb) {
      qb.join('stars', function() {
        this.on('stars.question_id', '=', 'questions.id')
        .andOn('stars.user_id', '=', userId)
        // bookshelf would not handle, so used knex.raw
        .andOn(db.knex.raw("stars.active = 't'"));
      })
      .select('questions.*')
      .from('questions');
    })
    .fetch();
  },
  fetchbyUser: function(userId) {
    return db.collection('questions')
    .forge()
    .query(function(qb){
      qb.where('user_id', '=', userId);
    })
    .fetch();
  }
});

module.exports = db.collection('Questions', Questions);