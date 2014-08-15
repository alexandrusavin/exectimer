var timers = {};

var timer = function(name) {
    if (typeof timers[name] == "undefined") {
        timers[name] = {
            ticks: [],
            median: function() {
                this.ticks.sort( function(a,b) {
                    return (a.end - a.start) - (b.end - b.start);
                });
                var half = Math.floor(this.ticks.length/2);

                if (this.ticks.length % 2) {
                    return (this.ticks[half].end - this.ticks[half].start);
                } else {
                    return (this.ticks[half-1].end - this.ticks[half-1].start)
                        + (this.ticks[half].end - this.ticks[half].start) / 2;
                }
            },
            mean: function() {
                return this.duration()/this.ticks.length;
            },
            duration: function() {
                for (var i=0,sum=0;i<this.ticks.length;i++) {
                    sum+=(this.ticks[i].end - this.ticks[i].start)
                }
                return sum;
            },
            min: function () {
                var min = this.ticks[0].end - this.ticks[0].start;
                this.ticks.forEach(function (tick) {
                    var diff = tick.end - tick.start;
                    if (diff < min) {
                        min = diff;
                    }
                })

                return min;
            },
            max: function () {
                var max = 0;
                this.ticks.forEach(function (tick) {
                    var diff = tick.end - tick.start;
                    if (diff > max) {
                        max = diff;
                    }
                })

                return max;
            },
            start: function() {
                return this.ticks[0].start;
            },
            end: function() {
                return this.ticks[this.ticks.length-1].end;
            },
            count: function() {
                return Object.keys(this.ticks).length;
            }
        }
    }

    return timers[name];
}

function tick (name) {
    this.name = name;
    return this;
}

tick.prototype.start = function () {
    var time = process.hrtime();
    this.start = time[1];
}

tick.prototype.stop = function () {
    var time = process.hrtime();
    this.end = time[1];
    timer(this.name).ticks.push(this);
}

module.exports = {
    timers: timers,
    tick: tick
}
