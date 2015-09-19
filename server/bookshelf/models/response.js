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
  // Override serialize to convert the stringified array to JSON
  serialize: function(options) {
    var attrs = db.Model.prototype.serialize.call(this, options);
    attrs.code_changes = JSON.parse(attrs.code_changes);
    return attrs;
  },
  owner: function() {
    return this.belongsTo('User');
  },
  question: function() {
    return this.belongsTo('Question');
  },
  comments: function() {
    return this.hasMany('Comment', 'parent_id').query(function(qb){
      qb.where('parent_type', '=', 'response');
    });
  },
  changeVotes: function(prevVote, upOrDown) {
    //subtract previous vote, add new vote
    var oldCount = this.get('vote_count');
    var newCount = oldCount - prevVote + upOrDown;
    if (newCount != oldCount) {
      this.set('vote_count', newCount);
      return this.save();
    }
  }
}, {
  fetchResponsebyId: function(id, notRequired) {
    return new this({
      id: id
    }).fetch({
      require: !notRequired,
      withRelated: ['owner', 'question', 'comments', 'comments.owner', 'comments.comments', 'comments.comments.owner']
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