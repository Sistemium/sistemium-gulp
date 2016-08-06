'use strict';

import {setDefaults} from './defaults';

var fs = require('fs');

exports.run = function (gulp, config) {

  setDefaults(config, gulp);

  fs.readdirSync('./gulp').filter(function(file) {
    return (/\.(js|coffee)$/i).test(file);
  }).map(function(file) {
    require('./gulp/' + file);
  });

  /**
   *  Default task clean temporaries directories and launch the
   *  main optimization build task
   */
  gulp.task('default', ['clean'], function () {
    gulp.start('build');
  });

};
