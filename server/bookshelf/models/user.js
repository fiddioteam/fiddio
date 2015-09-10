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
    done(null, user ? user.get('email') : false);
  },

  deserializeUser: function(email, done) {
    db.model('User').fetchUser(email, true)
    .then( function(user) {
      done(null, user ? user : false);
    })
    .catch( function(error) {
      done(error);
    });
  },

  fbAuthentication: function(req, accessToken, refreshToken, profile, done) {
    db.model('User').fetchUserbyFBId(profile.id)
    .then(function(user) {
      //If the user wasn't found, we will go to the catch block.
      if (!req.user || req.user.get('email') === user.get('email')) {
        // Return the user from the ORM so it can be passed to done()
        return user;
      }

      // We found a user, but it is not the right one.  Return false meaning not authorized.
      return false;
    })
    .catch( function(error) {
      var user = req.user || db.model('User').newUser({ name: profile.name.givenName + ' ' + profile.name.familyName });

      if (user) {
        user.set('fb_id', profile.id);
        if (profile.emails && profile.emails.length > 0) {
          user.set('email', profile.emails[0].value);
        }

        // Return the saved user from the ORM so it can be passed to done()
        return user.save();
      }

      // This should never happen.
      return false;
    })
    .then( function(user) {
      done(null, user);
    });
  },

  ghAuthentication: function(req, accessToken, refreshToken, profile, done) {
    db.model('User').fetchUserbyGHId(profile.id)
    .then(function(user) {
      if (!req.user || req.user.get('email') === user.get('email')) {
        return user;
      }

      return false;
    })
    .catch(function(error) {
      var user = req.user || db.model('User').newUser({ name: profile.displayName || '' });

      if (user) {
        user.set('gh_id', profile.id);
        if (profile.emails && profile.emails.length > 0) {
          user.set('email', profile.emails[0].value);
        }
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