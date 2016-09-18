const gulp = require('gulp');
const ngAnnotate = require('gulp-ng-annotate');
const conf = require('../conf/gulp.conf');
const angularFilesort = require('gulp-angular-filesort');
const concat = require ('gulp-concat-util');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');

gulp.task('build:finish', finishBuild);

function finishBuild() {

  return gulp.src(conf.path.src('**/*.js'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'))
    .pipe(ngAnnotate())
    .pipe(concat(conf.concat || 'index.js', {process: function(src) {
      return (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
    }}))
    .pipe(concat.header('\'use strict\';\n\n'))
    .pipe(gulp.dest(conf.path.dist()));

}

