Description
-----------

[![Test](https://github.com/alexandrusavin/exectimer/actions/workflows/test.yml/badge.svg)](https://github.com/alexandrusavin/exectimer/actions/workflows/test.yml) [![npm](https://img.shields.io/npm/v/exectimer.svg)](https://www.npmjs.com/package/exectimer)

Very simple but powerful nodejs and browser module build to track execution time with a resolution of nanoseconds.

Install
-------

Simply run:
```
npm install exectimer
```

Usage
-----

### Example

#### Wrapping an async function
```javascript
const t = require('exectimer');
const Tick = t.Tick;

async function main() {
    for (let i = 0; i < 10; i++) {
        // Resolves with the function's return value; the tick stops when the promise settles.
        await Tick.wrap(async function fetchUser() {
            await new Promise((resolve) => setTimeout(resolve, 10));
        });
    }

    t.timers.fetchUser.printResults();
}

main();
```

#### Wrapping generator
```javascript
const t = require('exectimer');
const Tick = t.Tick;

const promises = [];
for(var i = 0; i < 10; i++) {
    const functionExecution = Tick.wrap(function* myFunction() {
        yield Promise.resolve(true);
    });

    promises.push(functionExecution);
}

// After all ticks are finished
Promise.all(promises).then(() => {
    // display the results
    var results = t.timers.myFunction;
    console.log(results.parse(results.duration())); // total duration of all ticks
    console.log(results.parse(results.min()));      // minimal tick duration
    console.log(results.parse(results.max()));      // maximal tick duration
    console.log(results.parse(results.mean()));     // mean tick duration
    console.log(results.parse(results.median()));   // median tick duration
});
```

#### Wrapping
```javascript
const t = require('exectimer');
const Tick = t.Tick;


for(var i = 0; i < 10; i++) {
    Tick.wrap(function myFunction(done) {
        setTimeout(function() {
            done();
        }, 10);
    });
}

// Display the results
var results = t.timers.myFunction;
setTimeout(() => {
    console.log(results.parse(
        results.duration()
    )); // total duration of all ticks
    console.log(results.parse(
        results.min()
    ));      // minimal tick duration
    console.log(results.parse(
        results.max()
    ));      // maximal tick duration
    console.log(results.parse(
        results.mean()
    ));     // mean tick duration
    console.log(results.parse(
        results.median()
    ));   // median tick duration
}, 101);

```

#### Instantiating the ticks yourself

```javascript
const t = require('exectimer');
const Tick = t.Tick;

for(var i = 0; i < 10; i++) {
    // unique contexts to avoid aliasing (#9)
    (function () {
        var tick = new Tick("myFunction");
        tick.start();

        setTimeout(function() {
            tick.stop();
        }, Math.random() * 10);
    })();
}

// Display the results
var results = t.timers.myFunction;
setTimeout(() => {
    console.log(results.parse(
        results.duration()
    )); // total duration of all ticks
    console.log(results.parse(
        results.min()
    ));      // minimal tick duration
    console.log(results.parse(
        results.max()
    ));      // maximal tick duration
    console.log(results.parse(
        results.mean()
    ));     // mean tick duration
    console.log(results.parse(
        results.median()
    ));   // median tick duration
}, 101);

```

API
---

### Tick
 A tick is used to measure the difference between two execution points. All ticks are then used to calculate the average, median, min, max etc.
 Takes the name of the timer as an argument.

#### Tick.wrap()

 **Arguments**

 1. [`name`] *(String)* Name of the function
 1. `callback` *(Function)* Function for which to calculate the duration
 
 - **callback** Can be a function, an `async` function or a generator
     1. [`done`] *(Function)* Should be passed if function is asynchronous

 Static function that takes a name and a function as arguments. If the name is omitted then it tries to read the name of the function or it just uses "anon".
 If `done` function is not requested than it presumes that the call is synchronous.
 It also accepts a generator function in which case `done` function is not necessary.
 It also accepts an `async` function: the tick stops when the returned promise settles, and `Tick.wrap` returns a promise
 that resolves or rejects with the function's own result. If the callback throws, the tick is stopped and the error rethrown.
 
#### Tick.prototype.start()
 Starts the timer of this tick.
 
#### Tick.prototype.stop()
 Stops the timer of this tick.
 
### Timers
 Object containing all timers, keyed by name. Each timer has methods to calculate the various metrics. When a tick is created, it is pushed into the
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
 
#### Timers.TIMER.min()
 Get the shortest tick. Like `max()`, `median()` and `duration()`, it returns `0` for a timer without ticks (`mean()` returns `NaN`).

#### Timers.TIMER.max()
 Get the longest tick.

#### Timers.TIMER.mean()
 Get the average tick.

#### Timers.TIMER.median()
 Get the median tick.

#### Timers.TIMER.duration()
 Get the total duration of all ticks.

#### Timers.TIMER.count()
 Get the number of ticks.

#### Timers.TIMER.reset()
 Remove all recorded ticks from the timer. Useful in long-running processes, where ticks would otherwise accumulate.

#### Timers.TIMER.printResults()
 Print duration, min, max, mean and median to the console.

#### Timers.TIMER.parse()
 Parse the output of the previous methods from nanoseconds to us, ms, ns or seconds.
