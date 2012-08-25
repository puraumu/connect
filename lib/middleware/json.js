
/*!
 * Connect - json
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , _limit = require('./limit');

/**
 * noop middleware.
 */

function noop(req, res, next) {
  next();
}

/**
 * JSON:
 *
 * Parse JSON request bodies, providing the
 * parsed object as `req.body`.
 *
 * Options:
 *
 *   - `strict`  when `false` anything `JSON.parse()` accepts will be parsed
 *   - `reviver`  used as the second "reviver" argument for JSON.parse
 *   - `limit`  byte limit disabled by default
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function(options){
  var options = options || {}
    , strict = options.strict === false
      ? false
      : true;

  var limit = options.limit
    ? _limit(options.limit)
    : noop;

  return function json(req, res, next) {
    if (res._body) return next();
    res.body = res.body || {};

    // check Content-Type
    if ('application/json' != utils.mime(res)) return next();

    // flag as parsed
    res._body = true;

    // parse
    limit(req, res, function(err){
      if (err) return next(err);
      var buf = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk){ buf += chunk });
      res.on('end', function(){
        if (strict && '{' != buf[0] && '[' != buf[0]) return next(utils.error(400, 'invalid json'));
        try {
          res.body = JSON.parse(buf, options.reviver);
          next();
        } catch (err){
          err.body = buf;
          err.status = 400;
          next(err);
        }
      });
    });
  }
};
