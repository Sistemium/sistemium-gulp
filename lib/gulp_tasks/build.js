'use strict';

var gulp = require('gulp');
var filter = require('gulp-filter');
var useref = require('gulp-useref');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var sourcemaps = require('gulp-sourcemaps');
var uglifySaveLicense = require('uglify-save-license');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');
var replace = require('gulp-replace');
var manifest = require('gulp-manifest');
var del = require('del');
var through = require('through2');
var utimes = require('fs').utimes;

var conf = require('../conf/gulp.conf');

gulp.task('build:finish', finishBuild);

function finishBuild() {

  var partialsInjectFile = gulp.src(conf.path.tmp('templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: conf.paths.tmp,
    addRootSlash: false
  };

  var htmlFilter = filter(conf.path.tmp('*.html'), { restore: true });
  var jsFilter = filter(conf.path.tmp('**/*.js'), { restore: true });
  var cssFilter = filter(conf.path.tmp('**/*.css'), { restore: true });

  var touch = through.obj(function (file, enc, done) {
    var now = new Date();
    utimes(file.path, now, now, done);
  });

  return gulp.src(conf.path.tmp('/index.html')).pipe(replace('data-manifest=', 'manifest=')).pipe(inject(partialsInjectFile, partialsInjectOptions)).pipe(useref()).pipe(jsFilter)
  // .pipe(sourcemaps.init())
  .pipe(ngAnnotate()).pipe(uglify({ preserveComments: uglifySaveLicense })).on('error', conf.errorHandler('Uglify')).pipe(rev())
  // .pipe(sourcemaps.write('maps'))
  .pipe(jsFilter.restore).pipe(cssFilter).pipe(replace('fonts/bootstrap/', '../fonts/'))
  // .pipe(sourcemaps.init())
  .pipe(cssnano()).pipe(rev())
  // .pipe(sourcemaps.write('maps'))
  .pipe(cssFilter.restore).pipe(revReplace()).pipe(htmlFilter).pipe(htmlmin()).pipe(htmlFilter.restore).pipe(gulp.dest(conf.path.dist())).pipe(filter(conf.path.dist('index.html'))).pipe(touch);
}

gulp.task('manifest', function () {
  return gulp.src(conf.path.dist('/**/*')).pipe(manifest({
    hash: true,
    preferOnline: false,
    network: ['*'],
    filename: 'app.manifest',
    exclude: ['app.manifest', 'images/*']
  })).pipe(gulp.dest(conf.path.dist()));
});

gulp.task('build:cleanup', function () {
  return del(conf.paths.tmp + '/templateCacheHtml.js');
});