var passport = require('passport'),
    url      = require('url'),
    db       = require('../../bookshelf/config'),
    utility  = require('../../utility');

require('../../bookshelf/collections/questions');

module.exports = function(app, router) {

  router.get('/users/:userid/questions', function(req, res, next) {
    var userid = utility.getUrlParamNums(req, 'id').userid;

    db.collection('Questions').fetchbyUser(params.userid)
    .then( function(questions) {
      res.json({ questions: questions.toJSON() });
    });

  });

  router.get('/userInfo', function(req, res, next) {
    if (!req.user) {
      res.end();
    } else {
      res.json(req.user.toJSON());
    }
  });

  router.get('/fb', function(req, res, next) {
    req.session.redirect = url.parse(req.url, true).query.redirect;
    next();
  },
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
  }));

  router.get('/fb/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
      if (err) {
        return next(err);
      }
      var redirect = req.session.redirect;
      req.session.redirect = undefined;
      process.verb('User info', user);
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        if (redirect) {
          res.redirect( '/#' + redirect );
        } else {
          res.redirect('/');
        }
      });
    })(req, res, next);
  });

  router.get('/gh', function(req, res, next) {
    req.session.redirect = url.parse(req.url, true).query.redirect;
    next();
  },
  passport.authenticate('github', {
    scope: ['user:email']
  }));

  router.get('/gh/callback', function(req, res, next) {
    passport.authenticate('github', function(err, user, info) {
      if (err) {
        return next(err);
      }
      var redirect = req.session.redirect;
      req.session.redirect = undefined;
      process.verb('User info', user);
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        if (redirect) {
          res.redirect( '/#' + redirect );
        } else {
          res.redirect('/');
        }
      });
    })(req, res, next);
  });
};