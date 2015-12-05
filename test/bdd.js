'use strict';

const chai = require('chai');

const expect = chai.expect;

const timer = require('../index').timer;

const FakeTick = function (diffToReturn) {
    this.getDiff = function () {
        return diffToReturn;
    };
};

const getTimerWithTicks = function (name, diffs) {
    const testTimer = timer(name);

    for (let i = 0, len = diffs.length; i < len; i++) {
        testTimer.ticks.push(new FakeTick(diffs[i]));
    }

    return testTimer;
};

describe('BDD', function () {

    describe('Helpers', function() {
        describe('median', function () {

            it('should calculate the median correctly for a timer containing 1 tick', function () {
                const medianTestTimerWith1Ticks = getTimerWithTicks('medianTestTimerWith1Ticks', [1]);

                expect(medianTestTimerWith1Ticks.median()).to.equal(1);
            });

            it('should calculate the median correctly for a timer containing 3 ticks', function () {
                const medianTestTimerWith3Ticks = getTimerWithTicks('medianTestTimerWith3Ticks', [1, 2, 3]);

                expect(medianTestTimerWith3Ticks.median()).to.equal(2);
            });

            it('should calculate the median correctly for a timer containing 6 tick', function () {
                const medianTestTimerWith6Ticks = getTimerWithTicks('medianTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

                expect(medianTestTimerWith6Ticks.median()).to.equal(6.5);
            });

        });

        describe('mean', function () {

            it('should calculate the mean correctly for a timer containing 1 tick', function () {
                const meanTestTimerWith1Ticks = getTimerWithTicks('meanTestTimerWith1Ticks', [1]);

                expect(meanTestTimerWith1Ticks.mean()).to.equal(1);
            });

            it('should calculate the mean correctly for a timer containing 3 ticks', function () {
                const meanTestTimerWith3Ticks = getTimerWithTicks('meanTestTimerWith3Ticks', [1, 2, 3]);

                expect(meanTestTimerWith3Ticks.mean()).to.equal(2);
            });

            it('should calculate the mean correctly for a timer containing 6 tick', function () {
                const meanTestTimerWith6Ticks = getTimerWithTicks('meanTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

                expect(meanTestTimerWith6Ticks.mean()).to.equal(6.166666666666667);
            });

        });

        describe('duration', function () {

            it('should calculate the duration correctly for a timer containing 1 tick', function () {
                const durationTestTimerWith1Ticks = getTimerWithTicks('durationTestTimerWith1Ticks', [1]);

                expect(durationTestTimerWith1Ticks.duration()).to.equal(1);
            });

            it('should calculate the duration correctly for a timer containing 3 ticks', function () {
                const durationTestTimerWith3Ticks = getTimerWithTicks('durationTestTimerWith3Ticks', [1, 2, 3]);

                expect(durationTestTimerWith3Ticks.duration()).to.equal(6);
            });

            it('should calculate the duration correctly for a timer containing 6 tick', function () {
                const durationTestTimerWith6Ticks = getTimerWithTicks('durationTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

                expect(durationTestTimerWith6Ticks.duration()).to.equal(37);
            });

        });

        describe('min', function () {

            it('should calculate the min correctly for a timer containing 1 tick', function () {
                const minTestTimerWith1Ticks = getTimerWithTicks('minTestTimerWith1Ticks', [1]);

                expect(minTestTimerWith1Ticks.min()).to.equal(1);
            });

            it('should calculate the min correctly for a timer containing 3 ticks', function () {
                const minTestTimerWith3Ticks = getTimerWithTicks('minTestTimerWith3Ticks', [1, 2, 3]);

                expect(minTestTimerWith3Ticks.min()).to.equal(1);
            });

            it('should calculate the min correctly for a timer containing 6 tick', function () {
                const minTestTimerWith6Ticks = getTimerWithTicks('minTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

                expect(minTestTimerWith6Ticks.min()).to.equal(1);
            });

        });

        describe('max', function () {

            it('should calculate the max correctly for a timer containing 1 tick', function () {
                const maxTestTimerWith1Ticks = getTimerWithTicks('maxTestTimerWith1Ticks', [1]);

                expect(maxTestTimerWith1Ticks.max()).to.equal(1);
            });

            it('should calculate the max correctly for a timer containing 3 ticks', function () {
                const maxTestTimerWith3Ticks = getTimerWithTicks('maxTestTimerWith3Ticks', [1, 2, 3]);

                expect(maxTestTimerWith3Ticks.max()).to.equal(3);
            });

            it('should calculate the max correctly for a timer containing 6 tick', function () {
                const maxTestTimerWith6Ticks = getTimerWithTicks('maxTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

                expect(maxTestTimerWith6Ticks.max()).to.equal(10);
            });

        });

        describe('count', function () {

            it('should calculate the count correctly for a timer containing 1 tick', function () {
                const countTestTimerWith1Ticks = getTimerWithTicks('countTestTimerWith1Ticks', [1]);

                expect(countTestTimerWith1Ticks.count()).to.equal(1);
            });

            it('should calculate the count correctly for a timer containing 3 ticks', function () {
                const countTestTimerWith3Ticks = getTimerWithTicks('countTestTimerWith3Ticks', [1, 2, 3]);

                expect(countTestTimerWith3Ticks.count()).to.equal(3);
            });

            it('should calculate the count correctly for a timer containing 6 tick', function () {
                const countTestTimerWith6Ticks = getTimerWithTicks('countTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

                expect(countTestTimerWith6Ticks.count()).to.equal(6);
            });

        });
    });

    context('Generators', function() {
        var prom;
        const Tick = require('../index').Tick;

        beforeEach(function() {
            prom = '';
        });

        it('should resolve promises', function(done) {
            Tick.wrap('myOtherFunc', function* () {
                prom = yield Promise.resolve('foo');

                prom.should.equal('foo');
                done();
            });
        });

        it('should catch promises that do not succeed', function(done) {
            Tick.wrap('myOtherFunc', function* () {
                try {
                    yield Promise.reject(new Error('foo'));
                } catch(e) {
                    e.message.should.equal('foo');
                    done();
                }
            });
        });
    });

});