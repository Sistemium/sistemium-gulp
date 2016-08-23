'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var conf = require('./gulp.conf');
var listFiles = require('./karma-files.conf');

module.exports = function (config) {
  var configuration = {
    basePath: '../',
    singleRun: true,
    autoWatch: false,
    logLevel: 'INFO',
    junitReporter: {
      outputDir: 'test-reports'
    },
    browsers: ['PhantomJS'],
    frameworks: ['phantomjs-shim', 'jasmine', 'angular-filesort'],
    files: listFiles(),
    preprocessors: _defineProperty({}, conf.path.src('**/*.html'), ['ng-html2js']),
    ngHtml2JsPreprocessor: {
      stripPrefix: conf.paths.src + '/',
      moduleName: 'app'
    },
    angularFilesort: {
      whitelist: [conf.path.tmp('**/!(*.html|*.spec|*.mock).js')]
    },
    plugins: [require('karma-jasmine'), require('karma-junit-reporter'), require('karma-coverage'), require('karma-phantomjs-launcher'), require('karma-phantomjs-shim'), require('karma-ng-html2js-preprocessor'), require('karma-angular-filesort')]
  };

  config.set(configuration);
};