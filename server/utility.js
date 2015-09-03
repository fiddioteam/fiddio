var url = require('url');
    _   = require('lodash');

module.exports.resolveUrl = function() {
  return [].slice.call(arguments, 1).reduce(function(memo, path) {
    return url.resolve(memo, path);
  }, arguments[0]);
};

module.exports.getUrlParamNum = function(req, param) {
  var id = parseInt(req.params[param]);

  if (_.isNaN(id) || !_.isNumber(id)) {
    id = parseInt(url.parse(req.url, true).query[param]);
  }

  return id;
};