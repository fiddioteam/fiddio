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

  fetchUserbyFBId: function(fbid, notRequire) {
    return new this({
      fb_id: fbid
    }).fetch({
      require: !notRequire
    });
  },

  fetchUserbyGHId: function(ghid, notRequire) {
    return new this({
      gh_id: ghid
    }).fetch({
      require: !notRequire
    });
  },

  fetchUserbyMPId: function(mpid, notRequire) {
    return new this({
      mp_id: mpid
    }).fetch({
      require: !notRequire
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
    if (req.user && req.user.get('fb_id') === profile.id) {
      done(null, req.user);
      return;
    }

    var email = (profile.emails && profile.emails[0].value) || '';

    db.model('User').fetchUserbyFBId(profile.id, true)
    .then(function(user) {
      return user || db.model('User').fetchUser(email, true);
    })
    .then(function(user) {
      return user || db.model('User').newUser({ name: profile.name.givenName + ' ' + profile.name.familyName, email: email });
    })
    .then(function(user) {
      user.set('fb_id', profile.id);

      return user.save();
    })
    .then(function(user) {
      done(null, user);
    });
  },

  ghAuthentication: function(req, accessToken, refreshToken, profile, done) {
    if (req.user && req.user.get('gh_id') === profile.id) {
      done(null, req.user);
      return;
    }

    var email = (profile.emails && profile.emails[0].value) || '';

    db.model('User').fetchUserbyGHId(profile.id, true)
    .then(function(user) {
      return user || db.model('User').fetchUser(email, true);
    })
    .then(function(user) {
      return user || db.model('User').newUser({ name: profile.displayName || '', email: email });
    })
    .then(function(user) {
      user.set('gh_id', profile.id);
      user.set('profile_pic', profile.avatar_url);

      return user.save();
    })
    .then(function(user) {
      done(null, user);
    });
  },

  mpAuthentication: function(req, accessToken, refreshToken, profile, done) {
    if (req.user && req.user.get('mp_id') === profile.id) {
      done(null, req.user);
      return;
    }

    db.model('User').fetchUserbyMPId(profile.id, true)
    .then(function(user) {
      return user || db.model('User').fetchUser(profile.email, true);
    })
    .then(function(user) {
      return user || db.model('User').newUser({ name: profile.name, email: profile.email });
    })
    .then(function(user) {
      user.set('mp_id', profile.id);
      user.set('profile_pic', profile.avatar_url);

      return user.save();
    })
    .then(function(user) {
      done(null, user);
    });
  }
});

module.exports = db.model('User', User);