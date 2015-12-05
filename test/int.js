'use strict';

const should = require('should');
const async = require('async');

const t = require('./../index');
const Tick = t.Tick;

const suts = {
    testCustomInit: function(cb) {
        const tick = new Tick('testCustomInit');
        tick.start();
        setTimeout(function () {
            tick.stop();
            cb();
        }, 100);
    },
    testWrap: function(cb) {
        Tick.wrap('testWrap', function* () {
            yield new Promise(function(resolve, reject) {
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
                const items = [];

                for (let i = 0; i < 10; i++) {
                    items.push(suts[funcName]);
                }

                async.parallel(items, function () {
                    done();
                });
            });

            it('mean should be between 100 and 106 ms', function () {
                t.timers[funcName].mean().should.be.lessThan(0.106 * 1e9).and.greaterThan(0.1 * 1e9);
            });

            it('median should be between 100 and 106 ms', function () {
                t.timers[funcName].median().should.be.lessThan(0.106 * 1e9).and.greaterThan(0.1 * 1e9);
            });

            it('min should be between 100 and 106 ms', function () {
                t.timers[funcName].min().should.be.lessThan(0.106 * 1e9).and.greaterThan(0.1 * 1e9);
            });

            it('max should be between 100 and 108 ms', function () {
                t.timers[funcName].max().should.be.lessThan(0.108 * 1e9).and.greaterThan(0.1 * 1e9);
            });

            it('count should be 10', function () {
                t.timers[funcName].count().should.be.equal(10);
            });
        });
    });

});