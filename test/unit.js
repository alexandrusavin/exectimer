'use strict';

const chai = require('chai');
const async = require('async');
const expect = chai.expect;

const t = require('./../index');
const Tick = t.Tick;

describe('Unit', function () {
    describe('Timer', function () {

        const timer = t.timer;

        it('should return a timer object', function () {
            const newTimer = timer('mytimer');

            expect(newTimer).to.be.an.instanceOf(Object);
        });

        it('should have all needed helper functions', function () {
            const newTimer = timer('mytimer');
            const helpers = ['median', 'mean', 'duration', 'min', 'max', 'count', 'parse'];

            expect(newTimer).to.be.an.instanceof(Object)
                .and.include.keys(helpers);

            helpers.forEach(function (helper) {
                expect(newTimer[helper]).to.be.a('function');
            });
        });

    });

    describe('Tick', function () {

        it('should have helper functions', function () {
            const tick = new Tick('mytick');

            expect(tick.start).to.be.a('function');
            expect(tick.stop).to.be.a('function');
            expect(tick.getDiff).to.be.a('function');
        });

        it('should push a new item to the timers array', function () {
            const tick = new Tick('mytick');

            tick.start();
            tick.stop();

            expect(t.timers.mytick).to.be.an.instanceOf(Object);
        });

        context('wrapper', function () {

            it('should use function\'s name to add it to the timer array', function () {
                Tick.wrap(function myFunction(done) {
                    done();
                });

                expect(t.timers.myFunction).to.be.an.instanceOf(Object);
            });

            it('should use generator\'s name to add it to the timer array', function (cb) {
                Tick.wrap(function* myGenerator() {
                    expect(t.timers.myGenerator).to.be.an.instanceOf(Object);
                    cb();
                });
            });

            it('should measure all calls', function () {

                function myNewFunction(done) {
                    done();
                }

                for (let i = 0; i < 10; i++) {
                    Tick.wrap(myNewFunction);
                }

                expect(t.timers.myNewFunction.ticks).to.have.lengthOf(10);
            });

            it('should name anonymous functions `anon`', function () {
                Tick.wrap(function (done) {
                    done();
                });

                expect(t.timers.anon).to.be.instanceOf(Object);
                expect(t.timers.anon.ticks).to.have.a.lengthOf(1);
            });

            it('should overwrite function\'s name if set as argument', function () {
                Tick.wrap('anotherFunc', function someFuncNameThatShouldBePicked(done) {
                    done();
                });

                expect(t.timers.anotherFunc).to.be.instanceOf(Object);
                expect(t.timers.anotherFunc.ticks).to.have.a.lengthOf(1);

                expect(t.timers.someFuncNameThatShouldBePicked).to.be.an('undefined');
            });

            it('should throw if parameters are wrong', function () {
                expect(() => Tick.wrap('anotherFunc')).to.throw('Tick.wrap expects a callback function parameter');
            });
        });

    });

});
