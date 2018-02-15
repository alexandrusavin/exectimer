'use strict';

const co = require('co');

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
                } else {
                    return this.ticks[0].getDiff();
                }
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
        name = functionName(callback);
    }

    if (name === '') {
        name = 'anon';
    }

    const tick = new Tick(name);
    tick.start();

    const done = function () {
        tick.stop();
    };

    if (isGeneratorFunction(callback)) {
        return co(callback).then(done, done);
    } else if(isFunction(callback)) {
        // If done is passed when the callback is declared than we assume is async
        return callback(done);
    } else {
        // Otherwise just call the function and stop the tick
        tick.stop();
        return callback();
    }
};

/**
 * Starts the tick.
 */
Tick.prototype.start = function () {
    this.hrstart = process.hrtime();
    timer(this.name).ticks.push(this);
};

/**
 * Ends the tick.
 */
Tick.prototype.stop = function () {
    this.hrend = process.hrtime(this.hrstart);
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
 * Helper function used to check is argument is of type function
 * @author https://github.com/lodash/lodash/blob/4.16.4/lodash.js#L11590
 * @param value
 * @returns {boolean}
 */
function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? Object.prototype.toString.call(value) : '';
    return tag == '[object Function]' || tag == '[object GeneratorFunction]' || tag == '[object Proxy]';
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
