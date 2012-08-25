var respond = require('../')
  , http = require('http')

http.createServer(function(req, res) {
  if (req.url == '/') {
    var body = 'root'
    res.writeHead(200, {'Content-Length': body.length})
    res.end(body)
  };
  res.statusCode = 404
  res.end()
}).listen(3232)

var host = 'http://localhost:3232'

describe('respond.logger', function() {

  it('should show tiny format', function(done) {
    var app = respond()
    app.use(respond.logger('tiny'))
    app.request(host + '/', function(req, res) {
      done()
    }).end()
  })

  it('should show short format', function(done) {
    var app = respond()
    app.use(respond.logger('short'))
    app.request(host + '/', function(req, res) {
      done()
    }).end()
  })

  it('should show dev format', function(done) {
    var app = respond()
    app.use(respond.logger('dev'))
    app.request(host + '/', function(req, res) {
      done()
    }).end()
  })

  it('should show default format', function() {
  })

})

