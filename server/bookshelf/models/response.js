var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./issue');

var Response = db.Model.extend({
  tableName: 'responses',
  hasTimestamps: true,
  defaults: {
    vote_count: 0
  },
  owner: function() {
    return this.belongsTo('User');
  },
  issue: function() {
    return this.belongsTo('Issue');
  },
  changeVotes: function(upOrDown) {
    this.set('vote_count', this.get('vote_count') + upOrDown);
    return this.save();
  }
}, {
  fetchResponsebyId: function(id) {
    return new this({
      id: id
    }).fetch({
      require: true
    });
  },

  newResponse: function(options) {
    return new this(options);
  },
});

module.exports = db.model('Response', Response);