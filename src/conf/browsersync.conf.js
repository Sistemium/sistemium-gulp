const conf = require('./gulp.conf');
const _ = require('lodash');

module.exports = function () {
  return _.defaultsDeep(conf.defaults.browserSync, {
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
    port: 3000,
    ui: {
      port: 3001
    }
  });
};
