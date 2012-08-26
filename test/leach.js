var leach = require('../lib/leach')
  , num = 0

/**
 * Use "DEBUG=Leach mocha test"
 */

describe('Leach', function() {

  beforeEach(function() {
    // console.log('#' + num + ' begins')
    num++
  })

  describe('when `next` is invoked', function() {
    it('should decrement active member if no arguments are passed', function() {
      leach.do('hoge', function(next) {
        next()
      })
      leach.start('hoge')
    })
  })

  describe('when active member is smaller than the max', function() {
    it('should invoke the item immediately', function() {
      var c = 0
      leach.do('foo', function(obj, next) {
        obj.should.eql(c)
        c++
      })
      leach.do('hoge', function(next) {
        var len = 3
        for (var i = 0; i < len; i++) {
          next('foo', i)
        };
      })
      leach.start('hoge')
    })
  })

  describe('when active member is lager than the max', function() {
    it('should store the item', function() {
      leach.do('foo', function(obj, next) {
        setTimeout(function() {}, 20);
      })
      leach.do('hoge', function(next) {
        var len = 8
        for (var i = 0; i < len; i++) {
          next('foo', '#' + i)
        };
      })
      leach.start('hoge')
    })

    it('should invoke stored item and decrement active member if `next` is called', function(done) {
      var c = 0
        , len = 8
      leach.do('foo', function(obj, next) {
        setTimeout(function() {
          next()
        }, 20);
        c++;
        if (c == len) done();
      })
      leach.do('hoge', function(next) {
        for (var i = 0; i < len; i++) {
          next('foo', '#' + i)
        };
      })
      leach.start('hoge')
    })

  })

})
