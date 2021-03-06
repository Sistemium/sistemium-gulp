'use strict';

/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

import _ from 'lodash';
const path = require('path');
const gutil = require('gulp-util');
const defaults = require ('../defaults').defaults;

exports.ngModule = defaults.ngModule || 'webPage';
exports.defaults = defaults;
exports.styles = defaults.styles;

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: defaults.src || 'src',
  dist: defaults.dist || 'dist',
  tmp: defaults.tmp || '.tmp',
  e2e: defaults.e2e || 'e2e',
  tasks: defaults.tasks || 'gulp_tasks'
};

exports.paths.views = [
  `${exports.paths.src}/app/**/*.jade`,
  `${exports.paths.src}/app/**/*.pug`
];

exports.paths.libViews = [
  `${exports.paths.src}/**/*.jade`,
  `${exports.paths.src}/**/*.pug`
];

exports.gulp = defaults.gulp;
_.defaults (exports, defaults);

exports.path = {};
for (const pathName in exports.paths) {
  if (exports.paths.hasOwnProperty(pathName)) {
    exports.path[pathName] = function pathJoin() {
      const pathValue = exports.paths[pathName];
      const funcArgs = Array.prototype.slice.call(arguments);
      const joinArgs = [pathValue].concat(funcArgs);
      return path.join.apply(this, joinArgs);
    };
  }
}

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
  return function (err) {
    gutil.log(gutil.colors.red(`[${title}]`), err.toString());
    this.emit('end');
  };
};
/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [
    /\/bootstrap\.js$/,
    /\/bootstrap-sass\/.*\.js/,
    /\/bootstrap\.css/,
    /jquery/
  ],
  directory: 'bower_components'
};
