var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./question');

var Response = db.Model.extend({
  tableName: 'responses',
  hasTimestamps: true,
  defaults: {
    vote_count: 0
  },
  owner: function() {
    return this.belongsTo('User');
  },
  question: function() {
    return this.belongsTo('Question');
  },
  changeVotes: function(prevVote, upOrDown) {
    //subtract previous vote, add new vote
    this.set('vote_count', this.get('vote_count') - prevVote + upOrDown);
    return this.save();
  }
}, {
  fetchResponsebyId: function(id) {
    return new this({
      id: id
    }).fetch({
      require: true,
      withRelated: ['owner','question']
    });
  },
  newResponse: function(options) {
    return new this(options);
  },
  changeVotesbyId: function(responseId, prevVote, upOrDown) {
    return db.model('Response')
    .fetchResponsebyId(responseId)
    .then( function(response) {
      return response.changeVotes(prevVote, upOrDown);
    });
  }
});

module.exports = db.model('Response', Response);