var utility        = require('../utility'),
    passport       = require('passport'),
    GithubStrategy = require('passport-github').Strategy,
    db             = require('../bookshelf/config');
// load user model class
                     require('../bookshelf/models/user');

module.exports = function(app) {
  var urlAbsolute = process.isProd() ? process.env.urlAbsolute : process.env.urlAbsoluteDev;

  passport.use(new GithubStrategy({
    clientID: process.env.ghApiId,
    clientSecret: process.env.ghApiSecret,
    callbackUrl: utility.resolveUrl('http://', urlAbsolute, '/api/gh/callback'),
    enableProof: false,
    passReqToCallback: true
  }, db.model('User').ghAuthentication));

  passport.serializeUser(db.model('User').serializeUser);
  passport.deserializeUser(db.model('User').deserializeUser);

  app.use(passport.initialize());
  app.use(passport.session());

  return passport;
};