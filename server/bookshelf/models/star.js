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
      } else if (star.get('active') != active) {
        star.set('active', active);
      } else { return Promise.reject('did not change'); }

      return star.save();
    })
    .then( function() {
      return newVote.related('issue').changeStars(active || -1);
    })
    .catch( function() {});
  },
});

module.exports = db.model('Star', Star);