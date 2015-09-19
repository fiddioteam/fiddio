/**
 * Creates all API routes
 * @param  {Object} app     Instance object of Express middleware
 * @param  {Object} router  Instance object of Express router
 * @return {Object}         Return router for chaining
 */
var api = function(app, router) {
  require('./apis/users')(app, router);
  require('./apis/questions')(app, router);
  require('./apis/responses')(app, router);
  require('./apis/comments')(app, router);

  return router;
};

module.exports = api;