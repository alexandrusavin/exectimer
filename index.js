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
var timer = function(name) {
    if (typeof timers[name] == "undefined") {
        timers[name] = {
            ticks: [],

            /**
             * Get the median of all ticks.
             * @returns {*}
             */
            median: function() {
                this.ticks.sort( function(a,b) {
                    return (a.getDiff() - b.getDiff());
                });
                var half = Math.floor(this.ticks.length/2);

                if (this.ticks.length % 2) {
                    return (this.ticks[half].getDiff());
                } else {
                    return (this.ticks[half-1].getDiff()) + (this.ticks[half].getDiff()) / 2;
                }
            },

            /**
             * Get the average duration of all ticks.
             * @returns {number}
             */
            mean: function() {
                return this.duration()/this.ticks.length;
            },

            /**
             * Get the duration of all ticks.
             * @returns {number}
             */
            duration: function() {
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
             * DEPRICATED!!! Don't use this function as it doesn't work correctly and it is out of the scope
             * of this project.
             * TODO: Delete this function in the near future.
             * @returns {number}
             */
            start: function() {
                return this.ticks[0].getStart();
            },

            /**
             * DEPRICATED!!! Don't use this function as it doesn't work correctly and it is out of the scope
             * of this project.
             * TODO: Delete this function in the near future.
             * @returns {number}
             */
            end: function() {
                var lastTick = this.ticks[this.ticks.length-1];
                return lastTick.getStart() + lastTick.getDiff();
            },

            /**
             * Get the number of ticks.
             * @returns {Number}
             */
            count: function() {
                return Object.keys(this.ticks).length;
            },

            /**
             * Parse the numbers nicely.
             * @param num
             * @returns {string}
             */
            parse: function (num) {
                if (num < 1e3) {
                    return num + "ns";
                } else if (num >= 1e3 && num < 1e6) {
                    return num / 1e3 + "us";
                } else if (num >= 1e6 && num < 1e9) {
                    return num / 1e6 + "ms";
                } else if (num >= 1e9) {
                    return num / 1e9 + "s"
                }
            }
        }
    }

    return timers[name];
};

/**
 * Constructor of tick.
 * @param name The name of this tick.
 * @returns {Tick}
 * @constructor
 */
function Tick (name) {
    this.name = name;
    return this;
}

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
 * Get the start of the tick.
 * @returns Long nanoseconds
 */
Tick.prototype.getStart = function () {
    return this.hrstart[0] * 1e9 + this.hrstart[1];
};

/**
 * Get the duration of the tick.
 * @returns Long nanoseconds
 */
Tick.prototype.getDiff = function () {
    return this.hrend[0] * 1e9 + this.hrend[1];
};

module.exports = {
    timers: timers,
    Tick: Tick
};
