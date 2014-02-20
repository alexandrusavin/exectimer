var t = require("./index");

function calculate(num){
    var pi=4,top=4,bot=3,minus = true;
    next(pi,top,bot,minus,num);
}
function next(pi,top,bot,minus,num){

    for(var i=0;i<num;i++){
        var tickPi = new t.tick("pi");
        tickPi.start();
        pi += (minus == true)?-(top/bot):(top/bot);
        minus = !minus;
        bot+=2;
        tickPi.stop();
    }

    timer = t.timers.pi;

    console.log("Calculated pi with an accuracy of 9999999 in " + timer.duration()/1000 + "ms\n"
        + "Times per calculation:\n"
        + " average: " + timer.mean() + "us\n"
        + " median: " + timer.median() + "us\n"
        + " min: " + timer.min() + "us\n"
        + " max: " + timer.max() + "us\n"
        + " count: " + timer.count() + "\n"
        + " start: " + timer.start() + "\n"
        + " end: " + timer.end())
}

calculate(999999);