# Description

Very simple but powerful nodejs module build to track execution time with a resolution of nanoseconds.

[![Build Status](https://travis-ci.org/alexandrusavin/exectimer.png?branch=master)](https://travis-ci.org/alexandrusavin/exectimer)

## Install

Simply run:
```
npm install exectimer
```

## Usage

```javascript
 var t = require("exectimer");

 var myFunction() {
   var tick = new t.tick("myFunction");
   tick.start();
   // do some processing and end this tick
   tick.stop();
 }

 var myFunc_timer = t.timers.myFunction;
 // Display the results
 console.log(myFunc_timer.duration()); // total duration of all ticks
 console.log(myFunc_timer.min()); // minimal tick duration
 console.log(myFunc_timer.max()); // maximal tick duration
 console.log(myFunc_timer.mean()); // mean tick duration
 console.log(myFunc_timer.median()); // median tick duration
```
