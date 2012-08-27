
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter
  , proto = require('./proto')
  , utils = require('./utils')
  , basename = require('path').basename
  , fs = require('fs');

// expose createServer() as the module

exports = module.exports = createRequest;

/**
 * Framework version.
 */

exports.version = '0.0.0';

/**
 * Expose the prototype.
 */

exports.proto = proto;

/**
 * Auto-load middleware getters.
 */

exports.middleware = {};

/**
 * Expose utilities.
 */

exports.utils = utils;

/**
 * Response object place holder
 */

exports.holder = 0;

/**
 * Create a new http request.
 *
 * @return {Function}
 * @api public
 */

function createRequest() {
  var app;
  if (exports.holder == 0) {
    app = function app(res){ app.handle(res); }
  } else if (exports.holder == 1) {
    app = function app(err, res){ app.handle(res); }
  }
  utils.merge(app, proto);
  utils.merge(app, EventEmitter.prototype);
  app.route = '/';
  app.stack = [];
  for (var i = 0; i < arguments.length; ++i) {
    app.use(arguments[i]);
  }
  return app;
};

/**
 * Auto-load bundled middleware with getters.
 */

fs.readdirSync(__dirname + '/middleware').forEach(function(filename){
  if (!/\.js$/.test(filename)) return;
  var name = basename(filename, '.js');
  function load(){ return require('./middleware/' + name); }
  exports.middleware.__defineGetter__(name, load);
  exports.__defineGetter__(name, load);
});

