var microtime = require("microtime");

var timers = {};

module.exports.tick = function(name) {
    if (typeof timers[name] == "undefined") {
        timers[name] = {
            ticks: [{start: microtime.now()}],
            median: function() {
                this.ticks.sort( function(a,b) {
                    return (a.end - a.start) - (b.end - b.start);
                });
                var half = Math.floor(this.ticks.length/2);

                if (this.ticks.lenght % 2) {
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
                return this.valmin;
            },
            max: function () {
                return this.valmax;
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

    } else {
        var timer = timers[name];
        if (typeof timer.ticks[timer.ticks.length-1].end == "undefined") {
            timer.ticks[timer.ticks.length-1].end = microtime.now();
            var dif = timer.ticks[timer.ticks.length-1].end - timer.ticks[timer.ticks.length-1].start;

            if (timer.valmax > dif || typeof timer.valmax == "undefined"){
                timer.valmin = dif;
            }
            if (timer.valmax < dif || typeof timer.valmax == "undefined") {
                timer.valmax = dif
            }
        } else {
            var tick = {
                start: microtime.now()
            }
            timer.ticks.push(tick);
        }
    }

    return timers[name];
}

module.exports.timers = timers;
