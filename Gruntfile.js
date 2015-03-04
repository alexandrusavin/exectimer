module.exports = function(grunt) {
  var timer = require('grunt-timer');
  timer.init(grunt);

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: true
      },
      files: ['Gruntfile.js', '**/*.js', '!node_modules/**/*']
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitFiles: ['package.json'],
        push: false
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }
  });

};