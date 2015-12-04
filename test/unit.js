'use strict';

const should = require('should');
const async = require('async');

const t = require('./../index');
const Tick = t.Tick;

describe('Unit', function () {
    describe('Timer', function () {

        const timer = t.timer;

        it('should return a timer object', function () {
            const newTimer = timer('mytimer');

            newTimer.should.be.instanceOf(Object);
        });

        it('should have all needed helper functions', function () {
            const newTimer = timer('mytimer');
            const helpers = ['median', 'mean', 'duration', 'min', 'max', 'count', 'parse'];

            newTimer.should.be.an.instanceOf(Object).and.have.properties(helpers);

            helpers.forEach(function (helper) {
                newTimer[helper].should.be.type('function');
            });
        });

    });

    describe('Tick', function () {

        it('should have helper functions', function () {
            const tick = new Tick('mytick');

            tick.start.should.be.type('function');
            tick.stop.should.be.type('function');
            tick.getDiff.should.be.type('function');
        });

        it('should push a new item to the timers array', function () {
            const tick = new Tick('mytick');

            tick.start();
            tick.stop();

            t.timers.mytick.should.be.instanceOf(Object);
        });

        context('wrapper', function() {
            it('should return a tick object', function () {
                const tick = Tick.wrap(function myFunction(done) {
                    done();
                });

                tick.should.be.instanceOf(Tick);
            });

            it('should use it\'s name to add it to the timer array', function () {
                Tick.wrap(function myFunction(done) {
                    done();
                });

                t.timers.myFunction.should.be.instanceOf(Object);
            });

            it('should measure all calls', function () {

                function myNewFunction(done) {
                    done();
                }

                for (let i = 0; i < 10; i++) {
                    Tick.wrap(myNewFunction);
                }

                t.timers.myNewFunction.ticks.should.have.lengthOf(10);
            });

            it('should name anonymous functions `anon`', function () {
                Tick.wrap(function (done) {
                    done();
                });

                t.timers.anon.should.be.instanceOf(Object);
                t.timers.anon.ticks.should.have.a.lengthOf(1);
            });

            it('should overwrite function\'s name if set as argument', function () {
                Tick.wrap('anotherFunc', function someFuncNameThatShouldBePicked(done) {
                    done();
                });

                t.timers.anotherFunc.should.be.instanceOf(Object);
                t.timers.anotherFunc.ticks.should.have.a.lengthOf(1);

                should.not.exists(t.timers.someFuncNameThatShouldBePicked);
            });
        });

    });

});
