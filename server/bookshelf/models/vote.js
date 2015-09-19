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
  newVote: function(userId, responseId) {
    return new this({ user_id: userId, response_id: responseId });
  },
  fetchVote: function(userId, responseId, notRequired) {
    return db.model('Vote')
    .newVote(userId, responseId)
    .fetch({
      require: !notRequired
    });
  },
  // only one vote per user
  fetchOrCreate: function(userId, responseId, upOrDown) {
    upOrDown = Math.min( Math.max(upOrDown, -1), 1 ); // Limit upOrDown to -1, 0, 1.

    var newvote = db.model('Vote').newVote(userId, responseId);

    // create the model object
    // determines if already a vote in database
    return newvote.fetch({ require: false })
    .then(function(vote) {
      if (!vote) {
        vote = newvote;
      }

      var prevVote = vote.get('up_down') || 0;
      if (prevVote === upOrDown) { upOrDown = 0; }
      vote.set('up_down', upOrDown);

      return [vote.save(),db.model('Response').changeVotesbyId(responseId, prevVote, upOrDown)];
    });
  }
});

module.exports = db.model('Vote', Vote);