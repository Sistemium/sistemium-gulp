'use strict';

var conf = require('./gulp.conf');
var wiredep = require('wiredep');

module.exports = function listFiles() {
  var wiredepOptions = Object.assign({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  var patterns = wiredep(wiredepOptions).js.concat([conf.path.tmp('**/*.js'), conf.path.src('**/*.html')]);

  var files = patterns.map(function (pattern) {
    return { pattern: pattern };
  });
  files.push({
    pattern: conf.path.src('assets/**/*'),
    included: false,
    served: true,
    watched: false
  });
  return files;
};