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
  },
  upOrDown: function() {
    return this.get('upOrDown');
  },
  // only one vote per user
  fetchOrCreate: function(userId, responseId, upOrDown) {
    var options = {
      user: userId,
      response: responseId
    };

    var newVote = new this(options);

    // create the model object
    // determines if already a vote in database
    return newVote.fetch()
    .then(function(vote) {
      if (!vote) {
        vote = newVote;
      }

      var prevVote = vote.get('upOrDown');
      vote.set('upOrDown', upOrDown);

      vote.save();

      return db.model('Response').changeVotesbyId(responseId, prevVote, upOrDown);
    });
  }
});

module.exports = db.model('Vote', Vote);