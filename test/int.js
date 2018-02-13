'use strict';

const sinon = require('sinon');
const should = require('should');
const async = require('async');

const t = require('./../index');
const Tick = t.Tick;

const ACCEPTABLE_RESULT_RANGE_MIN = 0.099 * 1e9;
const ACCEPTABLE_RESULT_RANGE_MAX = 0.108 * 1e9;

const clock = sinon.useFakeTimers();

const suts = {
    testCustomInit: function(n, cb) {
        const tick = new Tick('testCustomInit');
        tick.start();
        setTimeout(function () {
            tick.stop();
            cb();
        }, 100);
    },
    testWrapFunction: function(n, cb) {
        Tick.wrap('testWrapFunction', (done) => {
            new Promise(function(resolve) {
                setTimeout(function () {
                    resolve();
                }, 100);
            }).then(() => {
                done();
                cb();
            });
        });
    },
    testWrapGenerator: function(n, cb) {
        Tick.wrap('testWrapGenerator', function* () {
            yield new Promise(function(resolve) {
                setTimeout(function () {
                    resolve();
                    cb();
                }, 100);
            });
        });
    }
};

describe('Integration - each 10 loops of 100ms timeouts', function () {

    Object.keys(suts).forEach(function(funcName) {
        describe(funcName, function() {
            before(function(done) {
                async.times(10, suts[funcName], function () {
                    done();
                });
                clock.runAll();
            });

            it('mean should be between 100 ms', function () {
                t.timers[funcName].mean().should.equal(100000000);
            });

            it('median should be between 100', function () {
                t.timers[funcName].median().should.equal(100000000);
            });

            it('min should be between 100 and 106 ms', function () {
                t.timers[funcName].min().should.equal(100000000);
            });

            it('max should be between 100', function () {
                t.timers[funcName].max().should.equal(100000000);
            });

            it('count should be 10', function () {
                t.timers[funcName].count().should.equal(10);
            });
        });
    });

    describe('tick without stop method called', () => {
        beforeEach(() => {
            const tick = new Tick('testTickWithoutStopCalled');
            tick.start();
        });

        it('should not throw', () => {
            const sut = t.timers.testTickWithoutStopCalled.median.bind(t.timers.testTickWithoutStopCalled);

            should(sut).not.throw();
        });
    });
});
