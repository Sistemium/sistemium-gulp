'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var conf = require('../conf/gulp.conf');

gulp.task('scripts', scripts);

function scripts() {
  return gulp.src(conf.path.src('**/*.js')).pipe(eslint()).pipe(eslint.format()).pipe(babel()).pipe(gulp.dest(conf.path.tmp()));
}