'use strict';

var should = require('should');
var async = require('async');

var t = require('./../index');
var Tick = t.Tick;

describe('Integration - 10 loops of 100ms timeouts', function () {

    before(function (done) {
        var items = [];

        function tesLoop(cb) {
            var tick = new Tick('testLoop');
            tick.start();
            setTimeout(function () {
                tick.stop();
                cb();
            }, 100);
        }

        for (var i = 0; i < 10; i++) {
            items.push(tesLoop);
        }

        async.parallel(items, function () {
            done();
        });
    });

    it('mean should be between 100 and 105 ms', function () {
        t.timers.testLoop.mean().should.be.lessThan(0.105 * 1e9).and.greaterThan(0.1 * 1e9);
    });

    it('median should be between 100 and 105 ms', function () {
        t.timers.testLoop.median().should.be.lessThan(0.105 * 1e9).and.greaterThan(0.1 * 1e9);
    });

    it('min should be between 100 and 105 ms', function () {
        t.timers.testLoop.min().should.be.lessThan(0.105 * 1e9).and.greaterThan(0.1 * 1e9);
    });

    it('max should be between 100 and 108 ms', function () {
        t.timers.testLoop.max().should.be.lessThan(0.108 * 1e9).and.greaterThan(0.1 * 1e9);
    });

    it('count should be 10', function () {
        t.timers.testLoop.count().should.be.equal(10);
    });
});