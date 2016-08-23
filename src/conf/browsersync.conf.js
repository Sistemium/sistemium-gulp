const conf = require('./gulp.conf');
const _ = require('lodash');

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ],
      routes: {
        '/bower_components': 'bower_components'
      }
    },
    open: false,
    reloadOnRestart: true,
    notify: false,
    port: _.get(conf.defaults,'browserSync.port') || 3000,
    ui: {
      port: _.get(conf.defaults,'browserSync.ui.port') || 3001
    }
  };
};
