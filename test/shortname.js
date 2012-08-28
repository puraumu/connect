var respond = require('../')
  , request = require('request')
  , superagent = require('superagent')
  , http = require('http')

http.createServer(function(req, res) {
  res.statusCode = 200
  res.end()
}).listen(3237)

var host = 'http://localhost'

describe('respond.shrotname', function() {

  describe('http.request', function() {
    it('should add properties to response object', function(done) {
      var app = respond()
      app.use(respond.shortname())
      http.request(host + '/', function(res) {
        app(res)
        // console.log(res);
        done()
      }).end()
    })
  })

  describe('request', function() {
    it('should add properties to response object', function(done) {
      var app = respond()
      app.use(respond.shortname())
      request(host + '/', function(err, res) {
        app(res)
        // console.log(res);
        res.len.should.a('number')
        done()
      })
    })
  })

  describe('superagent', function() {
    it('should ignore this client becase aleady added', function(done) {
      var app = respond()
      app.use(respond.shortname())
      superagent(host + '/', function(res) {
        app(res)
        // console.log(res);
        done()
      })
    })
  })


})

