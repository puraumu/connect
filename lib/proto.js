var EventEmitter = require('events').EventEmitter
  , debug = require('debug')('respond:dispatcher')
  , http = require('http')
  , utils = require('./utils')
  , path = require('path')
  , parse = require('url').parse
  , basename = path.basename
  , fs = require('fs')

/**
 * prototype
 */

var app = module.exports = {};

app.use = function(route, fn) {
  // default route to '/'
  if ('string' != typeof route) {
    fn = route;
    route = '/';
  }

  // wrap sub-apps
  if ('function' == typeof fn.handle) {
    var server = fn;
    fn.route = route;
    fn = function(res, next){
      server.handle(res, next);
    };
  }

  // strip trailing slash
  if ('/' == route[route.length - 1]) {
    route = route.slice(0, -1);
  }

  // add the middleware
  debug('use %s %s', route || '/', fn.name || 'anonymous');
  this.stack.push({ route: route, handle: fn });

  return this;
}

app.handle = function(res, out) {
  var req = res.socket._httpMessage
  if (!req) req = res.req;

  var stack = this.stack
    , fqdn = ~req.path.indexOf('://')
    , removed = ''
    , slashAdded = false
    , index = 0;

  function next(err) {
    var layer, path, status, c;

    if (slashAdded) {
      req.path = req.path.substr(1);
      slashAdded = false;
    }

    req.path = removed + req.path;
    req.originalUrl = req.originalUrl || req.path;
    removed = '';

    // next callback
    layer = stack[index++];

    if (!layer) {
      if (err) {
        debug(err.toString())
      } else {
        debug('pow');
      };
      return;
    };

    try {
      path = req.path;
      // path = utils.parseUrl(req).pathname;
      if (undefined == path) path = '/';

      // skip this layer if the route doesn't match.
      if (0 != path.indexOf(layer.route)) return next(err);

      c = path[layer.route.length];
      if (c && '/' != c && '.' != c) return next(err);

      // Call the layer handler
      // Trim off the part of the url that matches the route
      removed = layer.route;
      req.path = req.path.substr(removed.length);

      // Ensure leading slash
      if (!fqdn && '/' != req.path[0]) {
        req.path = '/' + req.path;
        slashAdded = true;
      }

      debug('%s', layer.handle.name || 'anonymous');
      var len = layer.handle.length;
      if (err) {
        if (len === 4) {
          layer.handle(err, req, res, next);
        } else {
          next(err);
        }
      }  else if (len < 4) {
        layer.handle(req, res, next);
      } else {
        next();
      }
    } catch (e) {
      next(e);
    }
  };
  next();
};

app.request = function(url, fn) {
  if (arguments.length == 2) {
    if (typeof url == 'string') this.use(parse(url).pathname, fn);
    else this.use(url.pathname, fn);
  };
  // console.log(this.stack);
  return http.request(url, this);

  // var req = http.request(options, this);
  // return req;

  // return http.request.call(this, options);
}

