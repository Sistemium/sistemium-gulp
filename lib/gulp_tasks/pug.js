'use strict';

var gulp = require('gulp');
var conf = require('../conf/gulp.conf');
var pug = require('gulp-pug');

gulp.task('pug', function () {
  return gulp.src(conf.paths.views).pipe(pug({
    pretty: true,
    doctype: 'html'
  })).pipe(gulp.dest('.tmp/app'));
});