var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./issue');

var Response = db.Model.extend({
  tableName: 'responses',
  hasTimestamps: true,
  owner: function() {
    return this.belongsTo('User');
  },
  issue: function() {
    return this.belongsTo('Issue');
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