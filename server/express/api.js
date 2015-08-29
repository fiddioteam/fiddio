var api = function(app, router) {
  require('./apis/users')(app, router);

  return router;
};

module.exports = api;