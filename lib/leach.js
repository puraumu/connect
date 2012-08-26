/**
 * Module dependencies.
 */

var debug = require('debug')('Leach')

/**
 * Leach prototype
 */

 var leach = module.exports = {};

/**
 * Max number of function to called at the same time.
 */

leach.max = 5;

/**
 * Store registered function.
 */

leach.actions = {};

/**
 * Set the function to be registered
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

leach.do = function(name, fn) {
  if (arguments.length == 1)  {
    if ('function' == typeof name && !name.name) {
      console.log('Sorry. Cannot determine function name.');
      console.log('Use "function NAME(){}"'
          + ' or "action.do(\'NAME\', function(){})" instead.');
      return false;
    };
    fn = name;
    name = name.name;
  };
  this.actions[name] = fn;
  return this;
}


/**
 * Invoke registered function by name. All arguments are preserved
 * and passed to the named function. The last argument is `next`.
 * This function will invoke the registered function if the name is
 * given. Otherwise stop this loop.
 *
 * Example:
 *
 *   app.do('foo', function(arg1, arg2, next) {
 *     arg1 // 22
 *     arg2 // 33
 *     next('bar', 'hoge', 'baz')
 *   })
 *   app.do('bar', function(arg1, arg2, next) {
 *     arg1 // 'hoge'
 *     arg2 // 'baz'
 *   })
 *   app.start('foo', 22, 33)
 *
 * The `max` controls functions number which work at the same
 * time. If the number of functions exceed `max`, functions are
 * stored in `pending`. By passing no arguments to `nest` stored
 * function will be invoked.
 *
 * @param {String} first, name
 * @api public
 */

leach.start = function(first) {
  var actions = this.actions
    , max = this.max
    , pending = []
    , active = 0

  function next(name) {
    var layer
      , args = [].slice.call(arguments, 1).concat(next)

    layer = actions[name];

    if (!layer) {
      if (pending.length) {
        var req = pending.shift();
        req.fn.apply(req.fn, req.args)
        debug('shifted');
      };
      active--;
      debug('active: ' + active)
      return;
    };

    active++;

    if (max < active) {
      pending.push({fn: layer, args: args});
      debug('pushed');
      return;
    };
    layer.apply(layer, args);
    // layer.apply(this, args);
  };

  return next.apply(this, [first].concat([].slice.call(arguments, 1)));
};

