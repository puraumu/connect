
/*!
 * Connect - cookieParser
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('./../utils')
  , cookie = require('cookie');

/**
 * Cookie parser:
 *
 * Parse _Cookie_ header and populate `req.cookies`
 * with an object keyed by the cookie names. Optionally
 * you may enabled signed cookie support by passing
 * a `secret` string, which assigns `req.secret` so
 * it may be used by other middleware.
 *
 * Examples:
 *
 *     connect()
 *       .use(connect.cookieParser('optional secret string'))
 *       .use(function(req, res, next){
 *         res.end(JSON.stringify(req.cookies));
 *       })
 *
 * @param {String} secret
 * @return {Function}
 * @api public
 */

module.exports = function cookieParser(secret){
  return function cookieParser(req, res, next) {
    if (res.cookies) return next();
    var cookies = res.headers['set-cookie'][0];

    res.secret = secret;
    res.cookies = {};
    res.signedCookies = {};

    if (cookies) {
      try {
        res.cookies = cookie.parse(cookies);
        if (secret) {
          res.signedCookies = utils.parseSignedCookies(res.cookies, secret);
          var obj = utils.parseJSONCookies(res.signedCookies);
          res.signedCookies = obj;
        }
        res.cookies = utils.parseJSONCookies(res.cookies);
      } catch (err) {
        return next(err);
      }
    }
    next();
  };
};
