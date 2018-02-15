'use strict';

var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var conf = require('../conf/gulp.conf');
var angularFilesort = require('gulp-angular-filesort');
var concat = require('gulp-concat-util');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');

gulp.task('build:finish', finishBuild);

function finishBuild() {

  return gulp.src([conf.path.src('**/*.js'), conf.path.tmp('templateCacheHtml.js')]).pipe(eslint()).pipe(eslint.format()).pipe(babel()).pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort')).pipe(ngAnnotate())
  // .pipe(inject(partialsInjectFile, partialsInjectOptions))
  .pipe(concat(conf.concat || 'index.js', { process: function process(src) {
      return (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
    } })).pipe(concat.header('\'use strict\';\n\n')).pipe(gulp.dest(conf.path.dist()));
}