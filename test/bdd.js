'use strict';

var chai = require('chai');

var expect = chai.expect;

var timer = require('../index').timer;

var FakeTick = function (diffToReturn) {
    this.getDiff = function () {
        return diffToReturn;
    };
};

var getTimerWithTicks = function (name, diffs) {
    var testTimer = timer(name);

    for (var i = 0, len = diffs.length; i < len; i++) {
        testTimer.ticks.push(new FakeTick(diffs[i]));
    }

    return testTimer;
};

describe('BDD', function () {

    describe('median', function () {

        it('should calculate the median correctly for a timer containing 1 tick', function () {
            var medianTestTimerWith1Ticks = getTimerWithTicks('medianTestTimerWith1Ticks', [1]);

            expect(medianTestTimerWith1Ticks.median()).to.equal(1);
        });

        it('should calculate the median correctly for a timer containing 3 ticks', function () {
            var medianTestTimerWith3Ticks = getTimerWithTicks('medianTestTimerWith3Ticks', [1, 2, 3]);

            expect(medianTestTimerWith3Ticks.median()).to.equal(2);
        });

        it('should calculate the median correctly for a timer containing 6 tick', function () {
            var medianTestTimerWith6Ticks = getTimerWithTicks('medianTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

            expect(medianTestTimerWith6Ticks.median()).to.equal(6.5);
        });

    });

    describe('mean', function () {

        it('should calculate the mean correctly for a timer containing 1 tick', function () {
            var meanTestTimerWith1Ticks = getTimerWithTicks('meanTestTimerWith1Ticks', [1]);

            expect(meanTestTimerWith1Ticks.mean()).to.equal(1);
        });

        it('should calculate the mean correctly for a timer containing 3 ticks', function () {
            var meanTestTimerWith3Ticks = getTimerWithTicks('meanTestTimerWith3Ticks', [1, 2, 3]);

            expect(meanTestTimerWith3Ticks.mean()).to.equal(2);
        });

        it('should calculate the mean correctly for a timer containing 6 tick', function () {
            var meanTestTimerWith6Ticks = getTimerWithTicks('meanTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

            expect(meanTestTimerWith6Ticks.mean()).to.equal(6.166666666666667);
        });

    });

    describe('duration', function () {

        it('should calculate the duration correctly for a timer containing 1 tick', function () {
            var durationTestTimerWith1Ticks = getTimerWithTicks('durationTestTimerWith1Ticks', [1]);

            expect(durationTestTimerWith1Ticks.duration()).to.equal(1);
        });

        it('should calculate the duration correctly for a timer containing 3 ticks', function () {
            var durationTestTimerWith3Ticks = getTimerWithTicks('durationTestTimerWith3Ticks', [1, 2, 3]);

            expect(durationTestTimerWith3Ticks.duration()).to.equal(6);
        });

        it('should calculate the duration correctly for a timer containing 6 tick', function () {
            var durationTestTimerWith6Ticks = getTimerWithTicks('durationTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

            expect(durationTestTimerWith6Ticks.duration()).to.equal(37);
        });

    });

    describe('min', function () {

        it('should calculate the min correctly for a timer containing 1 tick', function () {
            var minTestTimerWith1Ticks = getTimerWithTicks('minTestTimerWith1Ticks', [1]);

            expect(minTestTimerWith1Ticks.min()).to.equal(1);
        });

        it('should calculate the min correctly for a timer containing 3 ticks', function () {
            var minTestTimerWith3Ticks = getTimerWithTicks('minTestTimerWith3Ticks', [1, 2, 3]);

            expect(minTestTimerWith3Ticks.min()).to.equal(1);
        });

        it('should calculate the min correctly for a timer containing 6 tick', function () {
            var minTestTimerWith6Ticks = getTimerWithTicks('minTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

            expect(minTestTimerWith6Ticks.min()).to.equal(1);
        });

    });

    describe('max', function () {

        it('should calculate the max correctly for a timer containing 1 tick', function () {
            var maxTestTimerWith1Ticks = getTimerWithTicks('maxTestTimerWith1Ticks', [1]);

            expect(maxTestTimerWith1Ticks.max()).to.equal(1);
        });

        it('should calculate the max correctly for a timer containing 3 ticks', function () {
            var maxTestTimerWith3Ticks = getTimerWithTicks('maxTestTimerWith3Ticks', [1, 2, 3]);

            expect(maxTestTimerWith3Ticks.max()).to.equal(3);
        });

        it('should calculate the max correctly for a timer containing 6 tick', function () {
            var maxTestTimerWith6Ticks = getTimerWithTicks('maxTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

            expect(maxTestTimerWith6Ticks.max()).to.equal(10);
        });

    });

    describe('count', function () {

        it('should calculate the count correctly for a timer containing 1 tick', function () {
            var countTestTimerWith1Ticks = getTimerWithTicks('countTestTimerWith1Ticks', [1]);

            expect(countTestTimerWith1Ticks.count()).to.equal(1);
        });

        it('should calculate the count correctly for a timer containing 3 ticks', function () {
            var countTestTimerWith3Ticks = getTimerWithTicks('countTestTimerWith3Ticks', [1, 2, 3]);

            expect(countTestTimerWith3Ticks.count()).to.equal(3);
        });

        it('should calculate the count correctly for a timer containing 6 tick', function () {
            var countTestTimerWith6Ticks = getTimerWithTicks('countTestTimerWith6Ticks', [1, 4, 6, 7, 9, 10]);

            expect(countTestTimerWith6Ticks.count()).to.equal(6);
        });

    });

});