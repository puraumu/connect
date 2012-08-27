var respond = require('../')
  , http = require('http')

http.createServer(function(req, res) {
  res.statusCode = 200
  res.end()
}).listen(3235)

var host = 'http://localhost:3235'

describe('app.replace', function() {

  describe('when stack has object', function() {
    it('should replase the last object', function(done) {
      var app = respond()
      app.use(function() {})
      app.replace(function(req, res) {
        res.statusCode.should.eql(200)
        done()
      })
      app.request(host + '/').end()
    })
  })

  describe('when stack has no object', function() {
    it('should only return this', function() {
      var app = respond()
      app.replace(function() {}).should.eql(app)
      app.stack.should.empty
    })
  })

})

