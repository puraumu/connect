var respond = require('../')
  , http = require('http')

http.createServer(function(req, res) {
  var expires = new Date(0).toGMTString()
  res.writeHead(200, {'Set-Cookie': ['foo=bar; path=/; expires=' + expires]})
  res.end()
}).listen(3232)

var host = 'http://localhost:3232'

describe('cookieParser', function() {

  it('should show tiny format', function(done) {
    var app = respond()
    app.use(respond.cookieParser())
    app.request(host + '/', function(req, res) {
      // console.log(res.headers['set-cookie']);
      // console.log(res.cookies);
      res.cookies.foo.should.eql('bar')
      done()
    }).end()
  })

})

