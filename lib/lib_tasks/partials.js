'use strict';

var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var angularTemplatecache = require('gulp-angular-templatecache');

var conf = require('../conf/gulp.conf');

gulp.task('partials', partials);

function partials() {
  return gulp.src(conf.path.tmp('app/**/*.html')).pipe(htmlmin()).pipe(angularTemplatecache('templateCacheHtml.js', {
    module: conf.ngModule,
    root: '',
    moduleSystem: 'IIFE'
  })).pipe(gulp.dest(conf.path.tmp()));
}