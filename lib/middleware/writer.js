
/**
 * Module dependencies.
 */

var utils = require('../utils')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , basename = require('path').basename

/**
 * noop middleware.
 */

function noop(req, res, next) {
  next();
}

/**
 * Writer:
 *
 * Write response body. The file source is considerd
 * to be `res.body`. `req.path` is used for file name.
 *
 * Options:
 *
 *   - `dest`  file destination directory
 *   - `encoding`  encoding of file
 *
 * @param {String} dest
 * @param {String} encoding
 * @return {Function}
 * @api public
 */

exports = module.exports = function writer(dest, encoding){
  var dest = dest || __dirname + '/../public/'
    , encoding = encoding || 'utf8'

  return function writer(req, res, next) {
    if (!res.body || res.body == '') return next();

    var name = basename(req.path)

    if (name == '') name = req._headers.host;
    if (name[name.length - 1] == '/') name = name.substr(0, name.length - 1);
    if (dest[dest.length - 1] != '/') dest = dest + '/';

    mkdirp(dest, function(err) {
      if (err) return next(err);
      fs.writeFile(dest + escape(name), res.body, encoding, function(err) {
        if (err) return next(err);
        next();
      })
    });
  }
};

function escape(name) {
  return String(name)
    .replace(/\\/g, '')
    .replace(/\//g, '')
    .replace(/\|/g, '-')
    .replace(/\*/g, '')
    .replace(/\?/g, '')
    .replace(/:/g, '-')
    .replace(/"/g, '');
}


