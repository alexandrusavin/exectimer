'use strict';

const should = require('should');
const async = require('async');

const t = require('./../index');
const Tick = t.Tick;

const ACCEPTABLE_RESULT_RANGE_MIN = 0.1 * 1e9;
const ACCEPTABLE_RESULT_RANGE_MAX = 0.108 * 1e9;

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
            });

            it('mean should be between 100 and 106 ms', function () {
                t.timers[funcName].mean().should.be
                    .lessThan(ACCEPTABLE_RESULT_RANGE_MAX).and.greaterThan(ACCEPTABLE_RESULT_RANGE_MIN);
            });

            it('median should be between 100 and 106 ms', function () {
                t.timers[funcName].median().should.be
                    .lessThan(ACCEPTABLE_RESULT_RANGE_MAX).and.greaterThan(ACCEPTABLE_RESULT_RANGE_MIN);
            });

            it('min should be between 100 and 106 ms', function () {
                t.timers[funcName].min().should.be
                    .lessThan(ACCEPTABLE_RESULT_RANGE_MAX).and.greaterThan(ACCEPTABLE_RESULT_RANGE_MIN);
            });

            it('max should be between 100 and 108 ms', function () {
                t.timers[funcName].max().should.be
                    .lessThan(ACCEPTABLE_RESULT_RANGE_MAX).and.greaterThan(ACCEPTABLE_RESULT_RANGE_MIN);
            });

            it('count should be 10', function () {
                t.timers[funcName].count().should.be.equal(10);
            });
        });
    });

});
