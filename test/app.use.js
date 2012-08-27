var respond = require('../')
  , http = require('http')

http.createServer(function(req, res) {
  res.statusCode = 200
  res.end()
}).listen(3231)

var host = 'http://localhost:3231'

describe('app.use', function() {

  it('should add to stack', function() {
    var app = respond()
    app.use(function(req, res) {
      // body...
    })
    app.stack.should.have.length(1)
  })

  it('should catch response object', function(done) {
    var app = respond()
    http.request(host + '/', app.use(function(req, res) {
      res.statusCode.should.eql(200)
      done()
    })).end()
  })

})

