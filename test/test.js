var should = require('should');

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

});
