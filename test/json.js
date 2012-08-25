var respond = require('../')
  , http = require('http')

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end('{"foo": "bar", "hoge": "hoge"}')
}).listen(3232)

var host = 'http://localhost:3232'

describe('respond.json', function() {

  it('should parse response body as JSON', function(done) {
    var app = respond()
    app.use(respond.json())
    app.request(host + '/', function(req, res) {
      res.body.foo.should.eql('bar')
      done()
    }).end()
  })

})

