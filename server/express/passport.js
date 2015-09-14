var utility          = require('../utility'),
    passport         = require('passport'),
    GithubStrategy   = require('passport-github2').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    db               = require('../bookshelf/config');
// load user model class
                    require('../bookshelf/models/user');

module.exports = function(app) {
  var urlAbsolute = process.isProd() ? process.env.urlAbsolute : process.env.urlAbsoluteDev;

  passport.use(new GithubStrategy({
    clientID: process.isDev() ? process.env.ghApiIdDev : process.env.ghApiId,
    clientSecret: process.isDev() ? process.env.ghApiSecretDev : process.env.ghApiSecret,
    callbackUrl: utility.resolveUrl('http://', urlAbsolute, '/api/gh/callback'),
    enableProof: false,
    passReqToCallback: true
  }, db.model('User').ghAuthentication));

  passport.use(new FacebookStrategy({
    clientID: process.isDev() ? process.env.fbApiIdDev : process.env.fbApiId,
    clientSecret: process.isDev() ? process.env.fbApiSecretDev : process.env.fbApiSecret,
    callbackUrl: utility.resolveUrl('http://', urlAbsolute, '/api/fb/callback'),
    enableProof: false,
    passReqToCallback: true,
    profileFields: ['id', 'email', 'first_name', 'last_name']
  }, db.model('User').fbAuthentication));

  passport.serializeUser(db.model('User').serializeUser);
  passport.deserializeUser(db.model('User').deserializeUser);

  app.use(passport.initialize());
  app.use(passport.session());

  return passport;
};