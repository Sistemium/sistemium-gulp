'use strict';

import {setDefaults} from './defaults';
const gulp = require('gulp');
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');


exports.run = function (gulp, config) {

  config = setDefaults(config, gulp);
  config.base = config.base || '.';
  const conf = require('./conf/gulp.conf');

  // Load some files into the registry
  const hub = new HubRegistry([conf.path.tasks('*.js')]);

  // Tell gulp to use the tasks just loaded
  gulp.registry(hub);

  let buildTasks = [
    'clean', 'pug', 'styles', 'scripts', 'partials', 'inject', 'other',
    'build:finish', 'manifest', 'build:cleanup'
  ];

  gulp.task('inject:all', gulp.series(gulp.parallel('pug', 'styles', 'scripts'), 'inject'));
  gulp.task('build', gulp.series(buildTasks));
  gulp.task('test', gulp.series('scripts', 'karma:single-run'));
  gulp.task('test:auto', gulp.series('watch', 'karma:auto-run'));
  gulp.task('serve', gulp.series('inject:all', 'watch', 'browsersync'));
  gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
  gulp.task('default', gulp.series('clean', 'build'));
  gulp.task('watch', watch);

  function reloadBrowserSync(cb) {
    browserSync.reload();
    cb();
  }

  function watch(done) {

    gulp.watch([
      conf.path.src('index.html'),
      'bower.json'
    ], gulp.parallel('inject'));

    gulp.watch(conf.path.src('app/**/*.html'), reloadBrowserSync);

    gulp.watch([
      conf.path.src('app/**/*.jade'),
      conf.path.src('app/**/*.pug')
    ], gulp.series('pug', reloadBrowserSync));

    gulp.watch([
      conf.path.src('**/*.scss'),
      conf.path.src('**/*.css')
    ], gulp.series('styles'));

    gulp.watch(conf.path.src('**/*.js'), gulp.series(['scripts','inject'], reloadBrowserSync));

    done();
  }

};
