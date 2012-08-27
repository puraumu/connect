var respond = require('../')
  , http = require('http')

http.createServer(function(req, res) {
  if (req.url == '/') {
    var body = 'root'
    res.writeHead(200, {'Content-Length': body.length})
    res.end(body)
  };
}).listen(3236)

var host = 'http://localhost:3236'

describe('respond.writer', function() {

  function write(app, res, done) {
    res.body = ''
    res.on('data', function(chunk) { res.body += chunk })
    res.on('end', function() {
      app(res)
      setTimeout(function() {
        done()
      }, 10);
    })
  };

  it('should write `res.body` to public/', function(done) {
    var app = respond()
    app.use(respond.writer())
    http.get(host + '/', function(res) {
      write(app, res, done)
    })
  })

  it('should change destination directory', function(done) {
    var app = respond()
    app.use(respond.writer(__dirname + '/../lib/public/foo/'))
    http.get(host + '/', function(res) {
      write(app, res, done)
    })
  })

  it('should accept file encoding', function(done) {
    var app = respond()
    app.use(respond.writer(__dirname + '/../lib/public/bar/', 'ascii'))
    http.get(host + '/', function(res) {
      write(app, res, done)
    })
  })

})

