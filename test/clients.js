var respond = require('../')
  , sa = require('superagent')
  , request = require('request')
  , http = require('http')
  , express = require('express')
  , server = express()

server.get('/', function(req, res) {
  res.send('root');
});

server.get('/404', function(req, res) {
  res.statusCode = 404;
  res.send('not found');
});

server.listen(3010);

var host = 'http://localhost:3010'
  , logger = {immediate: true, format: 'dev'}

describe('work with third party modules', function() {
  it('should no errors', function(done) {
    var app = respond()
    // app.use(respond.logger(logger));

    app.use(function(req, res, next) {
      next();
    })

    /**
     * http.request
     */

    // console.log(app, respond);
    // return;
    http.request(host + '/', app).end()

    /**
     * superagent
     */

    sa.get(host + '/').end(function(res) {
      app(res);
    })

    /**
     * request
     */

    request(host + '/', function(err, res) {
      app(res);
      done()
    })

  })
})
