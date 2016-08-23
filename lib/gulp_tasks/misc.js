'use strict';

var path = require('path');

var gulp = require('gulp');
var del = require('del');
var filter = require('gulp-filter');

var conf = require('../conf/gulp.conf');

gulp.task('clean', clean);
gulp.task('other', other);

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}

function other() {
  var fileFilter = filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([path.join(conf.paths.src, '/**/*'), path.join('!' + conf.paths.src, '/**/*.{scss,js,html,pug,jade}')]).pipe(fileFilter).pipe(gulp.dest(conf.paths.dist));
}