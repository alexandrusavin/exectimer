/**
 * Contains all timers.
 * @type {{}}
 */
var timers = {};

/**
 * Timers factory object.
 * @param name
 * @returns {*}
 */
var timer = function (name) {
    if (typeof timers[name] === 'undefined') {
        timers[name] = {
            ticks: [],

            /**
             * Get the median of all ticks.
             * @returns {*}
             */
            median: function () {
                if (this.ticks.length > 1) {
                    this.ticks.sort(function (a, b) {
                        return a && b && (a.getDiff() - b.getDiff()) || 0;
                    });

                    var l = this.ticks.length;
                    var half = Math.floor(l / 2);


                    if (l % 2) {
                        return this.ticks[half].getDiff();
                    } else {
                        return (this.ticks[half - 1].getDiff() + this.ticks[half].getDiff()) / 2;
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
                for (var i = 0, sum = 0; i < this.ticks.length; i++) {
                    sum += this.ticks[i].getDiff();
                }
                return sum;
            },

            /**
             * Get the shortest tick.
             * @returns {number}
             */
            min: function () {
                var min = this.ticks[0].getDiff();
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
                var max = 0;
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
                    return num + 'ns';
                } else if (num >= 1e3 && num < 1e6) {
                    return num / 1e3 + 'us';
                } else if (num >= 1e6 && num < 1e9) {
                    return num / 1e6 + 'ms';
                } else if (num >= 1e9) {
                    return num / 1e9 + 's';
                }
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

    var tick = new Tick(name);
    tick.start();

    var done = function () {
        tick.stop();
    };

    callback(done);

    return tick;
};

/**
 * Starts the tick.
 */
Tick.prototype.start = function () {
    this.hrstart = process.hrtime();
};

/**
 * Ends the tick.
 */
Tick.prototype.stop = function () {
    this.hrend = process.hrtime(this.hrstart);
    timer(this.name).ticks.push(this);
};

/**
 * Get the duration of the tick.
 * @returns Long nanoseconds
 */
Tick.prototype.getDiff = function () {
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
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}