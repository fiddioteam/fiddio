var db      = require('../config'),
    Promise = require('bluebird');

require('./question');
require('./star');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  questions: function() {
    return this.hasMany('Question');
  },
  stars: function() {
    return this.hasMany('Star').through('Stars').withPivot('active');
  }
}, {
  fetchUserbyId: function(id) {
    return new this({
      id: id
    }).fetch({
      columns: ['first_name', 'last_name']
    });
  },

  fetchUser: function(email, notRequire) {
    // require true means if can't find user, reject the promise
    return new this({
      email: email
    }).fetch({
      require: !notRequire
    });
  },

  fetchUserbyFBId: function(fbid) {
    return new this({
      fb_id: fbid
    }).fetch({
      require: true
    });
  },

  fetchUserbyGHId: function(ghid) {
    return new this({
      gh_id: ghid
    }).fetch({
      require: true
    });
  },

  newUser: function(options) {
    return new this(options);
  },

  serializeUser: function(user, done) {
    if (user) {
      done( null, user.get('email'));
    } else {
      done(null, false);
    }
  },

  deserializeUser: function(email, done) {
    db.model('User').fetchUser(email)
    .then(function(user) {
      done(null, user ? user : false);
    })
    .catch(function(error) {
      done(error);
    });
  },

  fbAuthentication: function(req, accessToken, refreshToken, profile, done) {
    var self = this;

    db.model('User').fetchUserbyFBId(profile.id)
    .then(function(user) {
      if (!req.user || req.user.get('email') === user.get('email')) {
        return done(null, user);
      }

      return done(null, false);
    })
    .catch(function(error) {
      var user = req.user || db.model('User').newUser();

      if (user) {
        user.set('fb_id', profile.id);
        user.set('first_name', profile.name.givenName);
        user.set('last_name', profile.name.familyName);
        if (profile.emails && profile.emails.length > 0) {
          user.set('email', profile.emails[0].value);
        }

        user.save();

        return done(null, user);
      }

      return done(null, false);
    });
  },

  ghAuthentication: function(req, accessToken, refreshToken, profile, done) {
    var self = this;

    db.model('User').fetchUserbyGHId(profile.id)
    .then(function(user) {
      if (!req.user || req.user.get('email') === user.get('email')) {
        return done(null, user);
      }

      return done(null, false);
    })
    .catch(function(error) {
      var user = req.user || db.model('User').newUser();

      if (user) {
        user.set('gh_id', profile.id);
        // user.set('first_name', profile.name.givenName);
        // user.set('last_name', profile.name.familyName);
        // if (profile.emails && profile.emails.length > 0) {
          // user.set('email', profile.emails[0].value);
        //}

        user.save();

        return done(null, user);
      }

      return done(null, false);
    });
  }
});

module.exports = db.model('User', User);