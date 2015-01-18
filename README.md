Description
-----------

Very simple but powerful nodejs module build to track execution time with a resolution of nanoseconds.

[![Build Status](https://travis-ci.org/alexandrusavin/exectimer.png?branch=master)](https://travis-ci.org/alexandrusavin/exectimer)

Install
-------

Simply run:
```
npm install exectimer
```

Usage
-----

# Tick
 A tick is used to measure the difference between two execution points. They are than used to calculate the average, 
 median, min, max etc.
 Takes the name of the timer as an argument.
 
## Tick.start()
 Starts the timer of this tick.
 
## Tick.stop()
 Stops the timer of this tick.
 
#Timers
 Array of timers. Each timer has methods to calculate the various metrics. When a tick is created, it is pushed into the
 timer with name that was passed to the ticker in the constructor.
 
```
var tick = new t.Tick("TIMER");

tick.start();
// Do some processing
tick.stop();

var myTimer = t.timers.TIMER;

console.log("It took: " + myTimer.duration());
```
 You can name your timer however you want.
 
## Timers.TIMER.min()
 Get the shortest tick.

## Timers.TIMER.max()
 Get the longest tick.

## Timers.TIMER.mean()
 Get the average tick.

## Timers.TIMER.median()
 Get the median tick.

## Timers.TIMER.duration()
 Get the total duration of all ticks.

## Timers.TIMER.count()
 Get the number of ticks.

## Timers.TIMER.parse()
 Parse the output of the previous methods from nanoseconds to us, ms, ns or seconds.

# Example

```javascript
var t = require("exectimer");

function myFunction() {
   var tick = new t.Tick("myFunction");
   tick.start();
   // do some processing and end this tick
   tick.stop();
}

myFunction();

var myFunc_timer = t.timers.myFunction;
// Display the results
console.log(myFunc_timer.duration()); // total duration of all ticks
console.log(myFunc_timer.min());      // minimal tick duration
console.log(myFunc_timer.max());      // maximal tick duration
console.log(myFunc_timer.mean());     // mean tick duration
console.log(myFunc_timer.median());   // median tick duration
```
