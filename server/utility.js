var url = require('url');
    _   = require('lodash');

module.exports.getId = function(req) {
  return module.exports.getUrlParamNums(req, 'id').id;
};

module.exports.getUrlParamNums = function(req) {
  var method = req.method; //'GET', or 'POST'

  return [].slice.call(arguments,1)
    .reduce( function(memo, arg) {
      id = parseInt(req.params[arg]);
      if (_.isNaN(id) || !_.isNumber(id)) {
        if (method === 'GET' || method === 'DELETE') { //GET from query string
          id = parseInt(url.parse(req.url, true).query[arg]);
        } else { //PUT or POST from req.body json
          id = parseInt(req.body[arg]);
        }
      }
      memo[arg] = id;
      return memo;
  }, {});
};

module.exports.hasSession = function(req, res, next) {
  if (req.user) {
    next();
  } else { res.sendStatus(403); }
};