const sinon = require('sinon');
const chai = require('chai');
const async = require('async');

const clock = sinon.useFakeTimers();

const exectimer = require('./../index');
const Tick = exectimer.Tick;

const expect = chai.expect;

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
                expect(exectimer.timers[funcName].mean()).to.equal(100000000);
            });

            it('median should be between 100', function () {
                expect(exectimer.timers[funcName].median()).to.equal(100000000);
            });

            it('min should be between 100 and 106 ms', function () {
                expect(exectimer.timers[funcName].min()).to.equal(100000000);
            });

            it('max should be between 100', function () {
                expect(exectimer.timers[funcName].max()).to.equal(100000000);
            });

            it('count should be 10', function () {
                expect(exectimer.timers[funcName].count()).to.equal(10);
            });
        });
    });

    describe('tick without stop method called', () => {
        const functionName = 'testTickWithoutStopCalled';
        beforeEach(() => {
            const tick = new Tick(functionName);
            tick.start();
        });

        it('should not throw', () => {
            const sut = exectimer.timers[functionName].median.bind(exectimer.timers.testTickWithoutStopCalled);

            expect(sut).to.not.throw();
        });
    });
});
