'use strict';

var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var conf = require('../conf/gulp.conf');
var angularFilesort = require('gulp-angular-filesort');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');

gulp.task('build:finish', finishBuild);

function finishBuild() {

  return gulp.src(conf.path.src('**/*.js')).pipe(eslint()).pipe(eslint.format()).pipe(babel()).pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort')).pipe(ngAnnotate()).pipe(concat(conf.concat || 'index.js')).pipe(gulp.dest(conf.path.dist()));
}