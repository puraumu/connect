var respond = require('../')
  , http = require('http')

http.createServer(function(req, res) {
  res.statusCode = 200
  res.end()
}).listen(3232)

var host = 'http://localhost:3232'

describe('app.request', function() {

  it('should', function(done) {
    var app = respond()
    http.request(host + '/', app.use(function(req, res) {
      res.statusCode.should.eql(200)
      done()
    })).end()
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
