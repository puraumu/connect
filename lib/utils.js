/**
 * Module dependencies.
 */

var http = require('http')
  , parse = require('url').parse
  , Path = require('path')
  , fs = require('fs');

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     utils.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

exports.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @api private
 */

exports.parseUrl = function(req){
  var parsed = req._parsedUrl;
  if (parsed && parsed.href == req.url) {
    return parsed;
  } else {
    return req._parsedUrl = parse(req.url);
  }
};
/**
 * Parse JSON cookies.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

exports.parseJSONCookies = function(obj){
  Object.keys(obj).forEach(function(key){
    var val = obj[key];
    var res = exports.parseJSONCookie(val);
    if (res) obj[key] = res;
  });
  return obj;
};

/**
 * Parse JSON cookie string
 *
 * @param {String} str
 * @return {Object} Parsed object or null if not json cookie
 * @api private
 */

exports.parseJSONCookie = function(str) {
  if (0 == str.indexOf('j:')) {
    try {
      return JSON.parse(str.slice(2));
    } catch (err) {
      // no op
    }
  }
}



