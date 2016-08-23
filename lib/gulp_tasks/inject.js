'use strict';

var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var angularFilesort = require('gulp-angular-filesort');
var gulpInject = require('gulp-inject');

var conf = require('../conf/gulp.conf');

gulp.task('inject', inject);

function inject() {
  var injectScripts = gulp.src([conf.path.tmp('**/*.js'), '!' + conf.path.tmp('**/*.spec.js'), '!' + conf.path.tmp('templateCacheHtml.js')]).pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, conf.paths.tmp],
    addRootSlash: false
  };

  return gulp.src(conf.path.src('index.html')).pipe(gulpInject(injectScripts, injectOptions)).pipe(wiredep(Object.assign({}, conf.wiredep))).pipe(gulp.dest(conf.paths.tmp));
}