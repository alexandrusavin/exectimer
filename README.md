# Description

Very simple nodejs module that can be used to track the time that diferent execution blocks took to execute in microseconds.

## Example

```javascript
 var t = require("proctimer");

 var myFunction() {
   t.tick("myfuncton");
   // do some processing and end this tick
   t.tick("myfunction");
 }

 // Display the results
 console.log(t.timers.myfunction.duration()); // total duration of all ticks
 console.log(t.timers.myfunction.min()); // minimal tick duration
 console.log(t.timers.myfunction.max()); // maximal tick duration
 console.log(t.timers.myfunction.mean()); // mean tick duration
 console.log(t.timers.myfunction.median()); // median tick duration
 console.log(t.timers.myfunction.start()); // timestamp of the start of the first tick
 console.log(t.timers.myfunction.end()); // timestamp of the end of the last tick
```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/alexandrusavin/exectimer/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

