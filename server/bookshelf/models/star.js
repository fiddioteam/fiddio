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
      var changeCount = 0;

      if (star) {
        changeCount += active || -1;
      } else {
        star = newstar;
        changeCount += active;
      }

      star.set('active', active);

      return [star.save(),db.model('Question').changeStarsbyId(questionId, changeCount)];
    });
  }
});

module.exports = db.model('Star', Star);