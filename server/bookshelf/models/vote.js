var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./response');

var Vote = db.Model.extend({
  tableName: 'votes',
  defaults: {
    up_down: 0
  },
  user: function() {
    return this.belongsTo('User');
  },
  response: function() {
    return this.hasOne('Response');
  }
}, {
  fetchVote: function(userId, responseId, notRequired) {
    return new this({
      user_id: userId,
      response_id: responseId
      }).fetch({
        require: !notRequired
      });
  },
  // only one vote per user
  fetchOrCreate: function(userId, responseId, upOrDown) {
    upOrDown = Math.min( Math.max(upOrDown, -1), 1 ); // Limit upOrDown to -1, 0, 1.

    var options = {
      user_id: userId,
      response_id: responseId
    };

    var newVote = new this(options);

    // create the model object
    // determines if already a vote in database
    return newVote.fetch({ require: false })
    .then(function(vote) {
      if (!vote) {
        vote = newVote;
      }

      var prevVote = vote.get('up_down');
      vote.set('up_down', upOrDown);

      vote.save();

      return db.model('Response').changeVotesbyId(responseId, prevVote, upOrDown);
    });
  }
});

module.exports = db.model('Vote', Vote);