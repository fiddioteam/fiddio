var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./response');

var Vote = db.Model.extend({
  tableName: 'votes',
  user: function() {
    return this.belongsTo('User');
  },
  response: function() {
    return this.hasOne('Response');
  },
  upOrDown: function() {
    return this.get('upOrDown') || 0;
  },
  // only one vote per user
  fetchOrCreate: function(user, response, upOrDown) {
    var options = {
      user: user,
      response: response
    };
    var newVote = new this(options);

    // create the model object
    // determines if already a vote in database
    return newVote.fetch({withRelated: ['response']})
    .then(function(vote) {
      if (!vote) {
        vote = newVote;
      } else if (vote.get('upOrDown') != upOrDown) {
        vote.set('upOrDown', upOrDown);
      } else { return Promise.reject('did not change'); }
      return vote.save();
    })
    .then( function() {
      return newVote.related('response').changeVotes(upOrDown);
    })
    .catch( function() {});
  },
});

module.exports = db.model('Vote', Vote);