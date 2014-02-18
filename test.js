var t = require("./index");

function calculate(num){
    var pi=4,top=4,bot=3,minus = true;
    next(pi,top,bot,minus,num);
}
function next(pi,top,bot,minus,num){
    t.tick("pi");

    for(var i=0;i<num;i++){
        pi += (minus == true)?-(top/bot):(top/bot);
        minus = !minus;
        bot+=2;
        t.tick("pi");
    }

    timer = t.timers.pi;

    console.log("Calculated pi with an accuracy of 9999999 in " + timer.duration() + "us\n"
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