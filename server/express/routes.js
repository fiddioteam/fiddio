var path = require('path');
/**
 * All routes for backend
 * @param  {Object} app     Instance object of Express middleware
 * @param  {Object} express The Express library
 * @return {void}
 */
var routes = function(app, express) {
  // Serving static client files
  var loc = process.isProd() ? 'public' : 'test';

  app.use(express.static(path.join(__dirname, '../../', loc)));
  app.use('/audio', express.static(path.join(__dirname, '../../audio')));

  var router = require('./api')(app, express.Router());

  // api routes (/api/*)
  app.use('/api', router);
};

module.exports = routes;