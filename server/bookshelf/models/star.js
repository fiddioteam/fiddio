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
    // only one star per user
  fetchOrCreate: function(userId, questionId, active) {
    var options = {
      user_id: userId,
      question_id: questionId
    };

    // create the model object
    // determines if already a star in database
    var newStar = new this(options);

    return newStar
    .fetch()
    .then(function(star) {
      var changeCount = 0;

      if (star) {
        changeCount += active || -1;
      } else {
        star = newStar;
        changeCount += active;
      }

      star.set('active', active);
      star.save();

      return db.model('Question').changeStarsbyId(questionId, changeCount);
    });
  }
});

module.exports = db.model('Star', Star);