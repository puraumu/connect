var leach = require('../lib/leach')

describe('Leach.argv', function() {

  beforeEach(function() {
    // console.log('test begins');
  })

  it('should pass `next` to the last argument', function() {
    leach.do('foo', function(bar, hoge, next) {
      bar.should.eql('bar')
      hoge.should.eql('hoge')
    })
    leach.start('foo', 'bar', 'hoge')
  })

})

