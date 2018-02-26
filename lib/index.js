'use strict';

var _defaults = require('./defaults');

var HubRegistry = require('gulp-hub');
var browserSync = require('browser-sync');

exports.config = function (config) {
  (0, _defaults.setDefaults)(config);
  return exports;
};

exports.lib = function (gulp) {

  var conf = require('./conf/gulp.conf');

  var hub = new HubRegistry([conf.path.tasks('*.js'), conf.path.tasks('../gulp_tasks/misc.js')]);

  gulp.registry(hub);

  var buildTasks = ['clean', 'styles', 'others', 'pug',
  // 'styles',
  // 'scripts',
  'partials', 'build:finish'];

  function build(options) {
    return gulp.series(buildTasks, watch)(options);
  }

  gulp.task('default', build);

  function watch(done) {
    gulp.watch(conf.path.src('**/*.{js,pug,jade,scss}'), build);
    done();
  }
};

exports.run = function (gulp, config) {

  if (config) {
    (0, _defaults.setDefaults)(config);
  }

  var conf = require('./conf/gulp.conf');
  var hub = new HubRegistry([conf.path.tasks('*.js')]);

  // Tell gulp to use the tasks just loaded
  gulp.registry(hub);

  var buildTasks = ['clean', 'pug', 'styles', 'scripts', 'partials', 'inject', 'other', 'fonts', 'json', 'build:finish', 'manifest', 'build:cleanup'];

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

    gulp.watch([conf.path.src('index.html'), 'bower.json', conf.path.src('app/**/*.html'), conf.path.src('app/**/*.jade'), conf.path.src('app/**/*.pug'), conf.path.src('**/*.scss'), conf.path.src('**/*.css'), conf.path.src('**/*.js')], gulp.series('build', reloadBrowserSync));

    done();
  }

  function watch(done) {

    gulp.watch([conf.path.src('index.html'), 'bower.json'], gulp.series('inject', reloadBrowserSync));

    gulp.watch(conf.path.src('app/**/*.html'), reloadBrowserSync);

    gulp.watch([conf.path.src('app/**/*.jade'), conf.path.src('app/**/*.pug')], gulp.series('pug', reloadBrowserSync));

    gulp.watch(conf.path.src('app/**/*.json'), gulp.series('json', reloadBrowserSync));

    gulp.watch([conf.path.src('**/*.scss'), conf.path.src('**/*.css')], gulp.series('styles'));

    gulp.watch(conf.path.src('**/*.js'), gulp.series(['scripts', 'inject'], reloadBrowserSync));

    done();
  }
};