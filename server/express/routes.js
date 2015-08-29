var path = require('path');

var routes = function(app, express) {
  // Serving static client files
  var loc = process.isProd() ? 'public' : 'test';

  app.use(express.static(path.join(__dirname, '../../', loc)));

  var router = require('./api')(app, express.Router());

  // api routes (/api/*)
  app.use('/api', router);
};

module.exports = routes;