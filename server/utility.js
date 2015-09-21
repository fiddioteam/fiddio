var url = require('url');
    _   = require('lodash');

/**
 * Express convenience functions to capture stringified url parameters and convert them to numbers
 * @param  {Object} req Express request object
 * @return {Object}     JSON object of values retrieved from string ids
 */
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

/**
 * Express route intercepter that returns a 403 if the users isn't logged in
 * @param  {Object}   req  Express request object
 * @param  {Object}   res  Express response object
 * @param  {Function} next Express next function
 * @return {void}
 */
module.exports.hasSession = function(req, res, next) {
  if (req.user) {
    next();
  } else { res.sendStatus(403); }
};

/**
 * Removes keys that are listed. Can recurse and perform the removal on nested objects
 * @param  {Object}   target   The object targeted for key filtering
 * @param  {Array}    keyList  Array of keys to remove
 * @param  {Boolean}  recurse  If true, will recurse through nested objects
 * @return {void}
 */
module.exports.removeKeys = function(target, keyList, recurse) {
  return _.transform(target, function(r, v, k, t) {
    if (_.indexOf(keyList, k) === -1) {
      if (_.isPlainObject(v) && recurse) {
        r[k] = module.exports.removeKeys(t[k], keyList, recurse);
      } else { r[k] = v; }
    }
  });
};