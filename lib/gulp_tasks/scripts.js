'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var conf = require('../conf/gulp.conf');
var argv = require('yargs').argv;

gulp.task('scripts', scripts);
gulp.task('json', json);

function scripts() {
  return gulp.src(conf.path.src('**/*.js')).pipe(eslint()).pipe(eslint.format()).pipe(babel()).pipe(gulp.dest(conf.path.tmp()));
}

function json() {
  return gulp.src(conf.path.src('**/*.json')).pipe(gulp.dest(conf.path.tmp()));
}