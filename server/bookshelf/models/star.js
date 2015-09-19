var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./question');

var Star = db.Model.extend({
  tableName: 'stars',
  defaults: {
    active: true
  },
  user: function() {
    return this.belongsTo('User');
  },
  question: function() {
    return this.belongsTo('Question');
  }
},{
  newStar: function(userId, questionId) {
    return new this({ user_id: userId, question_id: questionId });
  },
  fetchStar: function(userId, questionId) {
    return db.model('Star').newStar(userId, questionId)
    .fetch({require: false});
  },
  // only one star per user
  fetchOrCreate: function(userId, questionId, active) {
    // create the model object
    // determines if already a star in database
    var newstar = db.model('Star').newStar(userId, questionId);

    return newstar
    .fetch({ require: false })
    .then( function(star) {
      if (!star) {
        star = newstar;
        star.set('active', false);
      }

      var upOrDown =  0 + (!star.get('active') && active) - (star.get('active') && !active);

      star.set('active', active);

      // If setting to active & already active -> 0
      // if setting to active & already inactive -> + 1
      // If setting to inactive & already active -> -1
      // If setting to inactive & already inactive -> 0

      //!gactive && active = 1
      //gactive && !active = -1

      return Promise.join([star.save(), db.model('Question')
      .changeStarsbyId(questionId, upOrDown)]);
    });
  }
});

module.exports = db.model('Star', Star);