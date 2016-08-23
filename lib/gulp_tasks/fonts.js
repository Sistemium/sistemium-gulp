'use strict';

var gulp = require('gulp');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var mainBowerFiles = require('gulp-main-bower-files');
var conf = require('../conf/gulp.conf');

gulp.task('fonts', function () {
  return gulp.src('./bower.json').pipe(mainBowerFiles()).pipe(filter('**/*.{eot,svg,ttf,woff,woff2}')).pipe(flatten()).pipe(gulp.dest(conf.path.dist('/fonts')));
});