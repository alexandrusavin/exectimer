'use strict';

const co = require('co');

/**
 * High-resolution clock with the same contract as Node's `process.hrtime([prev])`:
 * returns `[seconds, nanoseconds]`, or the difference to `prev` when given.
 * Uses `process.hrtime` in Node and falls back to `performance.now()` (or `Date.now()`)
 * elsewhere.
 */
const hrtime = (typeof process !== 'undefined' && process && typeof process.hrtime === 'function')
    ? process.hrtime
    : browserHrtime;

// Resolved once at load time, like browser-process-hrtime: replacing `performance.now` later
// (e.g. fake timers in a test) does not affect measurements.
const browserPerformance = (typeof performance !== 'undefined' && performance) || {};
const performanceNow =
    browserPerformance.now ||
    browserPerformance.mozNow ||
    browserPerformance.msNow ||
    browserPerformance.oNow ||
    browserPerformance.webkitNow ||
    function () {
        return new Date().getTime();
    };

/**
 * Contains all timers.
 * @type {{}}
 */
const timers = {};

/**
 * Timers factory object.
 * @param name
 * @returns {*}
 */
const timer = function (name) {
    if (typeof timers[name] === 'undefined') {
        timers[name] = {
            ticks: [],

            /**
             * Get the median of all ticks.
             * @returns {*}
             */
            median: function () {
                if (this.ticks.length > 1) {
                    const sorted = this.ticks.slice(0).sort(function (a, b) {
                        return a && b && (a.getDiff() - b.getDiff()) || 0;
                    });

                    const l = sorted.length;
                    const half = Math.floor(l / 2);


                    if (l % 2) {
                        return sorted[half].getDiff();
                    } else {
                        return (sorted[half - 1].getDiff() + sorted[half].getDiff()) / 2;
                    }
                } else if (this.ticks.length === 1) {
                    return this.ticks[0].getDiff();
                }

                return 0;
            },

            /**
             * Get the average duration of all ticks.
             * @returns {number}
             */
            mean: function () {
                return this.duration() / this.ticks.length;
            },

            /**
             * Get the duration of all ticks.
             * @returns {number}
             */
            duration: function () {
                let sum = 0;
                for (let i = 0, l = this.ticks.length; i < l; i++) {
                    sum += this.ticks[i].getDiff();
                }
                return sum;
            },

            /**
             * Get the shortest tick.
             * @returns {number}
             */
            min: function () {
                if (this.ticks.length === 0) {
                    return 0;
                }

                let min = this.ticks[0].getDiff();
                this.ticks.forEach(function (tick) {
                    if (tick.getDiff() < min) {
                        min = tick.getDiff();
                    }
                });

                return min;
            },

            /**
             * Get the longest tick.
             * @returns {number}
             */
            max: function () {
                let max = 0;
                this.ticks.forEach(function (tick) {
                    if (tick.getDiff() > max) {
                        max = tick.getDiff();
                    }
                });

                return max;
            },

            /**
             * Get the number of ticks.
             * @returns {Number}
             */
            count: function () {
                return Object.keys(this.ticks).length;
            },

            /**
             * Remove all recorded ticks from this timer.
             * @returns undefined
             */
            reset: function () {
                this.ticks.length = 0;
            },

            /**
             * Parse the numbers nicely.
             * @param num
             * @returns {string}
             */
            parse: function (num) {
                if (num < 1e3) {
                    return num + ' ns';
                } else if (num >= 1e3 && num < 1e6) {
                    return num / 1e3 + ' us';
                } else if (num >= 1e6 && num < 1e9) {
                    return num / 1e6 + ' ms';
                } else if (num >= 1e9) {
                    return num / 1e9 + ' s';
                }
            },

            /**
             * Utility function that prints all indicators.
             *
             * @returns undefined
             */
            printResults: function () {
              console.log('Total duration: %s', this.parse(this.duration()));
              console.log('Min: %s', this.parse(this.min()));
              console.log('Max: %s', this.parse(this.max()));
              console.log('Mean: %s', this.parse(this.mean()));
              console.log('Median: %s', this.parse(this.median()));
            }
        };
    }

    return timers[name];
};

/**
 * Constructor of tick.
 * @param name The name of this tick.
 * @returns {Tick}
 * @constructor
 */
function Tick(name) {
    this.name = name;
    return this;
}

Tick.wrap = function (name, callback) {
    if (typeof name === 'function') {
        callback = name;
        // Async functions are new in 2.3, so they get the reliable `fn.name`; other functions keep
        // the 2.x source-parsing behaviour so existing timer names don't change.
        name = isAsyncFunction(callback) ? callback.name : functionName(callback);
    }

    if (name === '') {
        name = 'anon';
    }

    if (!isFunction(callback)) {
        throw new Error('Tick.wrap expects a callback function parameter');
    }

    const tick = new Tick(name);
    tick.start();

    const done = function () {
        tick.stop();
    };

    // Stops the tick unless `done` already did.
    const settle = function () {
        if (!tick.hrend) {
            tick.stop();
        }
    };

    if (isGeneratorFunction(callback)) {
        return co(callback).then(done, done);
    }

    let result;
    try {
        result = callback(done);
    } catch (err) {
        settle();
        throw err;
    }

    // `async` functions are stopped when their promise settles; value and error are passed through.
    if (isAsyncFunction(callback) && result && typeof result.then === 'function') {
        return result.then(function (value) {
            settle();
            return value;
        }, function (err) {
            settle();
            throw err;
        });
    }

    return result;
};

/**
 * Starts the tick.
 */
Tick.prototype.start = function () {
    this.hrstart = hrtime();
    timer(this.name).ticks.push(this);
};

/**
 * Ends the tick.
 */
Tick.prototype.stop = function () {
    this.hrend = hrtime(this.hrstart);
};

/**
 * Get the duration of the tick.
 * @returns Long nanoseconds
 */
Tick.prototype.getDiff = function () {
    if(!this.hrend) {
        this.stop();
    }

    return this.hrend[0] * 1e9 + this.hrend[1];
};

module.exports = {
    timer: timer,
    timers: timers,
    Tick: Tick
};

/**
 * Helper function used to retrieve function name.
 * @param fun
 * @returns {string}
 */
function functionName(fun) {
    let ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret.trim();
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction(value) {
    return typeof value === 'function' && value.constructor.name === 'GeneratorFunction';
}

/**
 * Check if `value` is a native `async` function.
 * @param value
 * @returns {boolean}
 */
function isAsyncFunction(value) {
    return Object.prototype.toString.call(value) === '[object AsyncFunction]';
}

/**
 * Helper function used to check is argument is of type function
 * @author https://github.com/lodash/lodash/blob/4.16.4/lodash.js#L11590
 * @param value
 * @returns {boolean}
 */
function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? Object.prototype.toString.call(value) : '';
    return tag == '[object Function]' || tag == '[object GeneratorFunction]' ||
        tag == '[object AsyncFunction]' || tag == '[object Proxy]';
}

/**
 * Helper function used to check is argument is of type object
 * @author https://github.com/lodash/lodash/blob/4.16.4/lodash.js#L11590
 * @param value
 * @returns {boolean}
 */
function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}

/**
 * `process.hrtime` fallback for browsers, based on `performance.now()`.
 *
 * Inlined from browser-process-hrtime@1.0.0 (https://github.com/kumavis/browser-process-hrtime):
 *
 * Copyright 2014 kumavis
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @param {Array} [previousTimestamp]
 * @returns {Array} [seconds, nanoseconds]
 */
function browserHrtime(previousTimestamp) {
    const clocktime = performanceNow.call(browserPerformance) * 1e-3;
    let seconds = Math.floor(clocktime);
    let nanoseconds = Math.floor((clocktime % 1) * 1e9);

    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1e9;
        }
    }

    return [seconds, nanoseconds];
}
