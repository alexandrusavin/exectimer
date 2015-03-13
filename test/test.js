var should = require('should'),
  async = require('async');

var t = require('./../index');

describe('Timer', function() {

  var timer = t.timer;

  it('should return a timer object', function() {
    var newTimer = timer('mytimer');

    newTimer.should.be.instanceOf(Object);
  });

  it('should have all needed helper functions', function() {
    var newTimer = timer('mytimer');
    var helpers = ['median', 'mean', 'duration', 'min', 'max', 'count', 'parse'];

    newTimer.should.be.an.Object.and.have.properties(helpers);

    helpers.forEach(function(helper){
      newTimer[helper].should.be.type('function');
    });
  });

});

describe('Tick', function() {

  var Tick = t.Tick;

  it('should have helper functions', function() {
    var tick = new Tick('mytick');

    tick.start.should.be.type('function');
    tick.stop.should.be.type('function');
    tick.getDiff.should.be.type('function');
  });

  it('should push a new item to the timers array', function() {
    var tick = new Tick('mytick');

    tick.start();
    tick.stop();

    t.timers.mytick.should.be.instanceOf(Object);
  });

  it('should wrap a function and return a tick object', function() {
    var tick = Tick.wrap(function myFunction(done) {
      done();
    });

    tick.should.be.instanceOf(Tick);
  });

  it('should wrap a function and use it\'s name to add it to the timer array', function() {
    var tick = Tick.wrap(function myFunction(done) {
      done();
    });

    t.timers.myFunction.should.be.instanceOf(Object);
  });

  it('should wrap a function and measure all the calls of it.', function() {

    for(var i = 0; i < 10; i++) {
      Tick.wrap(function myNewFunction(done) {
        done();
      });
    }

    t.timers.myNewFunction.ticks.should.have.lengthOf(10);
  });

  it('should wrap anonymous functions too', function() {
    var tick = Tick.wrap(function (done) {
      done();
    });

    t.timers.anon.should.be.instanceOf(Object);
    t.timers.anon.ticks.should.have.a.lengthOf(1);
  });

  it('should wrap functions and use a different name than function\'s name', function() {
    Tick.wrap('myOtherFunc', function (done) {
      done();
    });

    t.timers.myOtherFunc.should.be.instanceOf(Object);
    t.timers.myOtherFunc.ticks.should.have.a.lengthOf(1);

    Tick.wrap('anotherFunc', function someFuncNameThatShouldBePicked (done) {
      done();
    });

    t.timers.anotherFunc.should.be.instanceOf(Object);
    t.timers.anotherFunc.ticks.should.have.a.lengthOf(1);

    should.not.exists(t.timers.someFuncNameThatShouldBePicked);
  });

  describe('Functionality - 10 loops of 100ms timeouts', function() {

    before(function(done) {
      var items = [];

      for (var i = 0; i < 10; i++) {
        items.push(function(cb) {
          var tick = new Tick('testLoop');
          tick.start();
          setTimeout(function() {
            tick.stop();
            cb();
          }, 100);
        });
      };

      async.parallel(items, function() {
        done();
      });
    });

    it('mean should be between 100 and 105 ms', function() {
      t.timers.testLoop.mean().should.be.lessThan(0.105*1e9).and.greaterThan(0.1 * 1e9);
    });

    it('median should be between 100 and 105 ms', function() {
      t.timers.testLoop.median().should.be.lessThan(0.105*1e9).and.greaterThan(0.1 * 1e9);
    });

    it('min should be between 100 and 105 ms', function() {
      t.timers.testLoop.min().should.be.lessThan(0.105*1e9).and.greaterThan(0.1 * 1e9);
    });

    it('max should be between 100 and 108 ms', function() {
      t.timers.testLoop.max().should.be.lessThan(0.108*1e9).and.greaterThan(0.1 * 1e9);
    });

    it('count should be 10', function() {
      t.timers.testLoop.count().should.be.equal(10);
    });
  });

});
