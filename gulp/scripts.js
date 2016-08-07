'use strict';

var path = require('path');
var conf = require('./conf');
var gulp = conf.gulp;
var plugins = conf.plugins;

var browserSync = require('browser-sync');

var $ = conf.plugins;


gulp.task('scripts-reload', function() {
  return lintScripts()
    .pipe(transpileScripts())
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return lintScripts()
    .pipe(transpileScripts());
});

function transpileScripts() {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js')
  ])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))

}

function lintScripts() {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.results(results => {
      console.log(`Total Results: ${results.length}`);
      console.log(`Total Warnings: ${results.warningCount}`);
      console.log(`Total Errors: ${results.errorCount}`);
    }))
    .pipe($.eslint.failAfterError())
    .pipe($.size())
}
