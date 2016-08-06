/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
import defaults from '../defaults';

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: defaults.src || 'src',
  dist: defaults.dist || 'dist',
  tmp: defaults.tmp || '.tmp',
  e2e: defaults.e2e || 'e2e'
};

exports.gulp = defaults.gulp;

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/jquery/, /\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/bootstrap\.css/],
  directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
  'use strict';

  return function (err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

exports.plugins = require('gulp-load-plugins')({
  scope: ['dependencies', 'devDependencies', 'peerDependencies']
});

console.info('required gulp/conf paths:', exports.paths);
