# Changelog

## 2.3.0

No breaking changes to the public API.

### Added
- `Tick.wrap()` accepts `async` functions. The tick stops when the returned promise settles, and
  `Tick.wrap()` returns a promise with the function's own value or error. Async functions are named
  using `fn.name`.
- `timer.reset()` removes all recorded ticks from a timer (ticks are otherwise kept forever).

### Fixed
- If a callback passed to `Tick.wrap()` throws, the tick is stopped and the error is rethrown.
  Previously the tick kept running until its duration was first read.
- `min()` and `median()` return `0` for a timer without ticks instead of throwing, consistent with
  `max()` and `duration()`. `mean()` still returns `NaN`.
- `Tick.wrap()` with an invalid callback no longer leaves a started tick behind.
- The browser fallback no longer throws a `ReferenceError` when bundled without a `process` polyfill
  (e.g. webpack 5).

### Changed
- Removed the `browser-process-hrtime` dependency; the same fallback is now inlined, with identical
  behaviour (including resolving `performance.now` once at load time).
- Removed the `co` dependency; `co@4.6.0` is vendored unchanged in `vendor/co.js` (MIT licence kept).
  exectimer now has no runtime dependencies.
- The published package only contains `index.js`, `vendor/co.js`, `README.md`, `LICENSE` and
  `package.json`.
- Tooling: CI on GitHub Actions for Node 22, 24 and 26; Mocha 12, Sinon 22; Karma, Webpack, Babel,
  Travis and Greenkeeper removed. The browser path is tested by running the module in a sandbox
  without `process`.
- Releases are published from GitHub Actions using npm trusted publishing, with provenance.

### Planned for 3.0 (breaking)
- Stop synchronous callbacks that don't take `done` immediately (today they run until first read).
- Name all functions via `fn.name` (arrow functions and methods are currently misnamed).
- Drop generator support (and the vendored `co`); ship ESM + CJS and TypeScript types.
