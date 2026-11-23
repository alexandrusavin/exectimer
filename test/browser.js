'use strict';

// Runs index.js in a sandbox without `process`, like a browser bundle would,
// to exercise the performance.now() fallback that replaced browser-process-hrtime.

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {createRequire} = require('module');
const expect = require('chai').expect;

const file = path.join(__dirname, '..', 'index.js');
const source = fs.readFileSync(file, 'utf8');
const requireFromIndex = createRequire(file);

function loadWithoutProcess(globals) {
    const mod = {exports: {}};
    const sandbox = Object.assign({console: console, setTimeout: setTimeout, Promise: Promise}, globals);
    const wrapper = '(function (module, exports, require) {' + source + '\n})';

    vm.runInNewContext(wrapper, sandbox, {filename: file})(mod, mod.exports, requireFromIndex);

    return mod.exports;
}

function fakePerformance(readings) {
    let i = 0;
    return {
        now: function () {
            return readings[Math.min(i++, readings.length - 1)];
        }
    };
}

describe('Browser-like environment (no process.hrtime)', function () {

    it('should not reference `process` when it is missing', function () {
        expect(() => loadWithoutProcess({performance: fakePerformance([0])})).to.not.throw();
    });

    it('should measure ticks with performance.now()', function () {
        const exectimer = loadWithoutProcess({performance: fakePerformance([1000.5, 1250.75])});
        const tick = new exectimer.Tick('browserTick');

        tick.start();
        tick.stop();

        expect(tick.getDiff()).to.be.closeTo(250.25e6, 1e3);
    });

    it('should carry nanoseconds correctly across a second boundary', function () {
        const exectimer = loadWithoutProcess({performance: fakePerformance([1999.9, 2000.1])});
        const tick = new exectimer.Tick('browserCarry');

        tick.start();
        tick.stop();

        expect(tick.hrend[0]).to.equal(0);
        expect(tick.getDiff()).to.be.closeTo(0.2e6, 1e3);
    });

    it('should keep using the performance.now() found at load time (like browser-process-hrtime)', function () {
        const performance = fakePerformance([100, 300]);
        const exectimer = loadWithoutProcess({performance: performance});
        performance.now = function () {
            return 0;
        };
        const tick = new exectimer.Tick('browserLoadTime');

        tick.start();
        tick.stop();

        expect(tick.getDiff()).to.be.closeTo(200e6, 1e3);
    });

    it('should fall back to Date when performance is not available', function () {
        const exectimer = loadWithoutProcess({});
        const tick = new exectimer.Tick('dateTick');

        tick.start();
        tick.stop();

        expect(tick.getDiff()).to.be.at.least(0);
    });

    it('should support async functions', async function () {
        const exectimer = loadWithoutProcess({performance: fakePerformance([10, 35])});

        const value = await exectimer.Tick.wrap('browserAsync', async () => 'done');

        expect(value).to.equal('done');
        expect(exectimer.timers.browserAsync.ticks[0].getDiff()).to.be.closeTo(25e6, 1e3);
    });
});
