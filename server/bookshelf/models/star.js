var db      = require('../config'),
    Promise = require('bluebird');

require('./user');
require('./issue');

var Star = db.Model.extend({
  tableName: 'stars',
  user: function() {
    return this.belongsTo('User');
  },
  issue: function() {
    return this.hasOne('Issue');
  },
  // only one star per user
  fetchOrCreate: function(user, issue, active) {
    var options = {
      user: user,
      issue: issue
    };
    var newStar = new this(options);

    // create the model object
    // determines if already a star in database
    newStar.fetch()
    .then(function(star) {
      if (!star) {
        star = newStar;
      }
      star.set('active', active);
      return star.save();
    });
  },
});

module.exports = db.model('Star', Star);