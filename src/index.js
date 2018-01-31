'use strict';

import {setDefaults} from './defaults';
const HubRegistry = require('gulp-hub');
const browserSync = require('browser-sync');

exports.config = function (config) {
  setDefaults(config);
  return exports;
};

exports.lib = (gulp) => {

  const conf = require('./conf/gulp.conf');

  gulp.registry(new HubRegistry([conf.path.tasks('*.js')]));

  gulp.task('default', gulp.series('build:finish', watch));

  function watch(done) {
    gulp.watch(conf.path.src('**/*.js'), gulp.series('build:finish'));
    done();
  }

};


exports.run = function (gulp, config) {

  if (config) {
    setDefaults(config);
  }

  const conf = require('./conf/gulp.conf');
  const hub = new HubRegistry([conf.path.tasks('*.js')]);

  // Tell gulp to use the tasks just loaded
  gulp.registry(hub);

  let buildTasks = [
    'clean', 'pug', 'styles', 'scripts', 'partials', 'inject', 'other', 'fonts',
    'json',
    'build:finish', 'manifest', 'build:cleanup'
  ];

  gulp.task('inject:all', gulp.series(gulp.parallel('pug', 'styles', 'scripts', 'json'), 'inject'));
  gulp.task('test', gulp.series('scripts', 'karma:single-run'));
  gulp.task('test:auto', gulp.series('watch', 'karma:auto-run'));
  gulp.task('serve', gulp.series('inject:all', 'watch', 'browsersync'));
  gulp.task('serve:dist', gulp.series('build', 'browsersync:dist', watchDist));
  gulp.task('default', gulp.series('serve'));
  gulp.task('watch', watch);

  function build(options) {
    return gulp.series(buildTasks)(options);
  }

  build.flags = {
    '--sales': 'Builds only sales module'
  };

  gulp.task('build', build);

  function reloadBrowserSync(cb) {
    browserSync.reload();
    cb();
  }

  function watchDist(done) {

    gulp.watch([
      conf.path.src('index.html'),
      'bower.json',
      conf.path.src('app/**/*.html'),
      conf.path.src('app/**/*.jade'),
      conf.path.src('app/**/*.pug'),
      conf.path.src('**/*.scss'),
      conf.path.src('**/*.css'),
      conf.path.src('**/*.js')
    ], gulp.series('build', reloadBrowserSync));

    done();

  }

  function watch(done) {

    gulp.watch([
      conf.path.src('index.html'),
      'bower.json'
    ], gulp.series('inject', reloadBrowserSync));

    gulp.watch(conf.path.src('app/**/*.html'), reloadBrowserSync);

    gulp.watch([
      conf.path.src('app/**/*.jade'),
      conf.path.src('app/**/*.pug')
    ], gulp.series('pug', reloadBrowserSync));

    gulp.watch([
      conf.path.src('**/*.scss'),
      conf.path.src('**/*.css')
    ], gulp.series('styles'));

    gulp.watch(conf.path.src('**/*.js'), gulp.series(['scripts', 'inject'], reloadBrowserSync));

    done();
  }

};
