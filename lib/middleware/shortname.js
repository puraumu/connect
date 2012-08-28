
/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * ShortName:
 *
 *   Access response headers with ease.
 *
 * @return {Function}
 * @api public
 */

module.exports = function shortname(){
  return function shortname(req, res, next){
    // self-awareness
    if (req._shortname || res.statusType) return next();
    req._shortname = true;

    var status = res.status = res.statusCode;
    res.header = res.headers;
    res.type = mime(res.headers['content-type']);
    res.len = res.headers['content-length']
      ? parseInt(res.headers['content-length'], 10)
      : ''
    res.redirects = req.redirects
      ? req.redirects
      : []

    var type = status / 100 | 0;
    res.statusType = type;
    // basics
    res.info = 1 == type;
    res.ok = 2 == type;
    res.redirect = 3 == type;
    res.clientError = 4 == type;
    res.serverError = 5 == type;
    res.error = 4 == type || 5 == type;

    // sugar
    res.accepted = 202 == status;
    res.noContent = 204 == status;
    res.badRequest = 400 == status;
    res.unauthorized = 401 == status;
    res.notAcceptable = 406 == status;
    res.notFound = 404 == status;

    next();
  };
};

function mime(str) {
  str = str || '';
  return str.split(/ *; */).shift();
};
