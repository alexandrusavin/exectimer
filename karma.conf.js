module.exports = (config) => {
    config.set({
        basePath: 'test',
        frameworks: ['mocha'],
        files: [
            'int.js'
        ],
        preprocessors: {
            './int.js': ['webpack'],
        },
        reporters: ['progress', 'mocha'],
        webpack: {
            devtool: 'inline-source-map'
        },
        port: 9876,
        colors: true,
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        browsers: ['Chrome_travis_ci'],
        singleRun: true,
    });
};
