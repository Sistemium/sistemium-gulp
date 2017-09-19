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
var pipe = require('gulp-pipe');
var _ = require('lodash');
var identity = require('gulp-uglify');

var conf = require('../conf/gulp.conf');

var webkitAssign = require('webkit-assign/gulp');

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

  var cssReplace = [replace('fonts/bootstrap/', '../fonts/')];

  Array.prototype.push.apply(cssReplace, _.map(_.get(conf, 'build.replace.css'), function (val, key) {
    return replace(key, val);
  }));

  var jsReplace = [identity()];

  Array.prototype.push.apply(jsReplace, _.map(_.get(conf, 'build.replace.js'), function (val, key) {
    return replace(key, val);
  }));

  function preservator(name, comments) {
    return uglifySaveLicense(name, comments);
    // || /^.*Click$/.test(name);
  }

  var uglifyOptions = _.assign({ preserveComments: preservator }, _.get(conf, 'build.uglify') || {});

  return gulp.src(conf.path.tmp('/index.html')).pipe(replace('data-manifest=', 'manifest=')).pipe(inject(partialsInjectFile, partialsInjectOptions)).pipe(useref()).pipe(jsFilter).pipe(webkitAssign())
  // .pipe(sourcemaps.init())
  .pipe(ngAnnotate()).pipe(pipe(jsReplace)).pipe(uglify(uglifyOptions)).on('error', conf.errorHandler('Uglify')).pipe(rev())
  // .pipe(sourcemaps.write('maps'))
  .pipe(jsFilter.restore).pipe(cssFilter).pipe(pipe(cssReplace))
  // .pipe(sourcemaps.init())
  .pipe(cssnano({
    zindex: false
  })).pipe(rev())
  // .pipe(sourcemaps.write('maps'))
  .pipe(cssFilter.restore).pipe(revReplace()).pipe(htmlFilter).pipe(htmlmin()).pipe(replace('<script src=', '<script charset="utf-8" src=')).pipe(htmlFilter.restore).pipe(gulp.dest(conf.path.dist())).pipe(filter(conf.path.dist('index.html'))).pipe(touch);
}

gulp.task('manifest', function () {
  return gulp.src(conf.path.dist('/**/*')).pipe(manifest({
    hash: true,
    preferOnline: false,
    network: ['*'],
    filename: 'app.manifest',
    exclude: ['app.manifest']
  })).pipe(gulp.dest(conf.path.dist()));
});

gulp.task('build:cleanup', function () {
  return del(conf.paths.tmp + '/templateCacheHtml.js');
});