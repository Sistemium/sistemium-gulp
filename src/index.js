'use strict';

import {setDefaults, defaults} from './defaults';
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

exports.config = function (config) {
  setDefaults(config);
  return exports;
}


exports.run = function (gulp, config) {

  config = config ? setDefaults(config, gulp) : defaults;

  const conf = require('./conf/gulp.conf');
  const hub = new HubRegistry([conf.path.tasks('*.js')]);

  // Tell gulp to use the tasks just loaded
  gulp.registry(hub);

  let buildTasks = [
    'clean', 'pug', 'styles', 'scripts', 'partials', 'inject', 'other', 'fonts',
    'build:finish', 'manifest', 'build:cleanup'
  ];

  gulp.task('inject:all', gulp.series(gulp.parallel('pug', 'styles', 'scripts'), 'inject'));
  gulp.task('build', gulp.series(buildTasks));
  gulp.task('test', gulp.series('scripts', 'karma:single-run'));
  gulp.task('test:auto', gulp.series('watch', 'karma:auto-run'));
  gulp.task('serve', gulp.series('inject:all', 'watch', 'browsersync'));
  gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
  gulp.task('default', gulp.series('serve'));
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
