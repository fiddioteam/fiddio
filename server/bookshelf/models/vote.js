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
    newVote.fetch()
    .then(function(vote) {
      if (!vote) {
        vote = newVote;
      }
      vote.set('upOrDown', upOrDown);
      return vote.save();
    });
  },
});

module.exports = db.model('Vote', Vote);