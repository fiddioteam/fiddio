var url = require('url');

module.exports.resolveUrl = function() {
  return [].slice.call(arguments, 1).reduce(function(memo, path) {
    return url.resolve(memo, path);
  }, arguments[0]);
};