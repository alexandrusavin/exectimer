'use strict';

const chai = require('chai');
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
            const helpers = ['median', 'mean', 'duration', 'min', 'max', 'count', 'parse', 'reset'];

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

            it('should not register a tick when the callback is invalid', function () {
                expect(() => Tick.wrap('invalidCallbackTimer', 42)).to.throw();
                expect(t.timers.invalidCallbackTimer).to.be.an('undefined');
            });

            it('should rethrow errors from the callback and stop the tick', function () {
                const error = new Error('boom');

                expect(() => Tick.wrap('throwingFunc', function () {
                    throw error;
                })).to.throw(error);

                expect(t.timers.throwingFunc.ticks).to.have.lengthOf(1);
                expect(t.timers.throwingFunc.ticks[0].hrend).to.be.an('array');
            });

            it('should keep the time recorded by done() if the callback throws afterwards', function () {
                expect(() => Tick.wrap('doneThenThrowFunc', function (done) {
                    done();
                    throw new Error('late');
                })).to.throw('late');

                const tick = t.timers.doneThenThrowFunc.ticks[0];
                const recorded = tick.hrend;
                expect(recorded).to.be.an('array');
                expect(tick.hrend).to.equal(recorded);
            });

            context('async functions', function () {

                it('should accept an async function and name it', function () {
                    const result = Tick.wrap(async function myAsyncFunction() {
                        return 'ok';
                    });

                    expect(result).to.be.a('promise');
                    expect(t.timers.myAsyncFunction).to.be.an.instanceOf(Object);
                    return result;
                });

                it('should resolve with the value of the async function', async function () {
                    const value = await Tick.wrap('asyncValue', async () => 42);

                    expect(value).to.equal(42);
                });

                it('should stop the tick when the promise resolves', async function () {
                    await Tick.wrap('asyncTiming', async () => {
                        await new Promise((resolve) => setTimeout(resolve, 20));
                    });

                    const tick = t.timers.asyncTiming.ticks[0];
                    expect(tick.hrend).to.be.an('array');
                    expect(tick.getDiff()).to.be.at.least(15e6).and.below(1e9);
                });

                it('should pass rejections through and still stop the tick', async function () {
                    const error = new Error('nope');
                    let caught;

                    try {
                        await Tick.wrap('asyncRejection', async () => {
                            throw error;
                        });
                    } catch (e) {
                        caught = e;
                    }

                    expect(caught).to.equal(error);
                    expect(t.timers.asyncRejection.ticks[0].hrend).to.be.an('array');
                });

                it('should honour done() when an async function asks for it', async function () {
                    let tick;

                    await Tick.wrap('asyncWithDone', async (done) => {
                        tick = t.timers.asyncWithDone.ticks[0];
                        done();
                        await new Promise((resolve) => setTimeout(resolve, 20));
                    });

                    expect(tick.getDiff()).to.be.below(15e6);
                });
            });
        });

    });

});
