var url = require('url');
    _   = require('lodash');

module.exports.resolveUrl = function() {
  return [].slice.call(arguments, 1).reduce(function(memo, path) {
    return url.resolve(memo, path);
  }, arguments[0]);
};

module.exports.getUrlParamNums = function(req) {
  return [].slice.apply(arguments,1)
  .reduce( function(memo, arg) {
    id = req.params[arg];
    if (_.isNaN(id) || !_.isNumber(id)) {
      id = parseInt(url.parse(req.url, true).query[arg]);
    }
    memo[arg] = id;
    return memo;
  }, {});
};