var respond = require('../')
  , http = require('http')

http.createServer(function(req, res) {
  res.statusCode = 200
  res.end()
}).listen(3230)

var host = 'http://localhost:3230'

describe('app.request', function() {

  it('should catch response object', function(done) {
    var app = respond()
    app.use(function(req, res) {
      res.statusCode.should.eql(200)
      done()
    })
    http.request(host + '/', function(res) {
      app(res)
    }).end()
  })

  it('should invoke http.request', function(done) {
    function test(req, res, next) {
      res.statusCode.should.eql(200)
      next(done())
    };
    var app = respond()
      , req = app.request(host + '/', test)
    req.end();
  })

})
