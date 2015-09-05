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
    }).fetch({ require: true });
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

  deserializeUser: function(id, done) {
    db.model('User').fetchUser(email)
    .then( function(user) {
      done(null, user ? user : false);
    })
    .catch( function(error) {
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
    .catch( function(error) {
      var user = req.user || db.model('User').newUser();

      if (user) {
        user.set('fb_id', profile.id);
        user.set('name', profile.name.givenName + ' ' + profile.name.familyName);
        if (profile.emails && profile.emails.length > 0) {
          user.set('email', profile.emails[0].value);
        }

        return user.save();
      }

      return false;
    })
    .then( function(user) {
      done(null, user);
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
      process.verb('profile', profile);

      if (user) {
        user.set('gh_id', profile.id);
        if (profile.emails && profile.emails.length > 0) {
          user.set('email', profile.emails[0].value);
        }
        user.set('name', profile.displayName);
        user.set('profile_pic', profile.avatar_url);

        return user.save();
      }

      return false;
    })
    .then( function(user) {
      done(null, user);
    });
  }
});

module.exports = db.model('User', User);